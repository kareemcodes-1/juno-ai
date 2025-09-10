import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import connectDB from "@/config/connectDB";
import Agent from "@/models/Agent";
import Chat from "@/models/Chat";
import Lead from "@/models/Lead";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function withCORS<T>(json: T, status = 200) {
  return NextResponse.json(json, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// --- Role-based templates ---
const roleInstructions: Record<string, string> = {
  "sales-agent": `
You are {{agentName}}, a sales representative for {{businessName}}.
Your job:
- Answer questions about {{businessInfo}}.
- Encourage the user to leave their contact info (email or phone) so sales can follow up.
- Keep replies short, friendly, and focused on sales. 
- Do not make up roles or random job titles.
- If you don’t know, say: “I’ll connect you with {{ownerName}} at {{ownerEmail}}.”
`,

  "customer-support": `
You are {{agentName}}, a support agent for {{businessName}}.
Your job:
- Help customers with {{businessInfo}}.
- Be empathetic, clear, and professional.
- If an issue needs escalation, tell the user you’ll connect them with {{ownerName}} at {{ownerEmail}}.
- Do not invent details outside the provided info.
`,

  "faq-agent": `
You are {{agentName}}, a FAQ assistant for {{businessName}}.
Your job:
- Answer common questions about {{businessInfo}}.
- Be brief and to the point.
- If unsure, direct the user to {{ownerName}} at {{ownerEmail}}.
- Stay strictly on-topic.
`,
};

// --- Simple regex extractors ---
function extractEmail(text: string): string | null {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : null;
}

function extractPhone(text: string): string | null {
  const match = text.match(/(\+?\d{1,3}[-.\s]?)?\d{7,14}/);
  return match ? match[0] : null;
}

// --- API Handler ---
export async function POST(req: Request) {
  try {
    await connectDB();
    const { messages, agentId, sessionId, device = "unknown" } =
      await req.json();

    if (!messages || messages.length === 0) {
      return withCORS({ reply: "No message provided." }, 400);
    }

    // Find agent with populated user
    const agent = await Agent.findById(agentId).populate("user");
    if (!agent) return withCORS({ reply: "Agent not found." }, 404);

    const ownerName = agent.user?.name || "The Owner";
    const ownerEmail = agent.user?.email || "contact@example.com";

    const userMessage = messages[messages.length - 1].content;
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Pick template
    const template =
      roleInstructions[agent.role] || roleInstructions["sales-agent"];

    // Fill placeholders
    const instruction = template
      .replace(/{{agentName}}/g, agent.name)
      .replace(/{{businessName}}/g, agent.business || "our business")
      .replace(/{{businessInfo}}/g, agent.instructions || "")
      .replace(/{{ownerName}}/g, ownerName)
      .replace(/{{ownerEmail}}/g, ownerEmail);

    const prompt = `
${instruction}

Rules:
- Never say you are an AI, Google, or language model.
- Stay strictly in character.
- Do not invent random roles or company details.
- Keep responses under 120 words.
- Always answer as {{agentName}}.

User: ${userMessage}
Assistant:
`;

    // --- Generate reply ---
    let reply = "I’m here to help!";
    try {
      const result = await model.generateContent(prompt);
      reply = result.response.text().trim();
    } catch (err) {
      console.error("Gemini error:", err);
      reply = `I’ll connect you with ${ownerName} at ${ownerEmail}.`;
    }

    // --- Save chat ---
    await Chat.findOneAndUpdate(
      { sessionId, agent: agent._id, workspace: agent.workspace },
      {
        $push: {
          messages: [
            { role: "user", content: userMessage },
            { role: "bot", content: reply },
          ],
        },
      },
      { upsert: true, new: true }
    );

    // --- Lead detection ---
    const email = extractEmail(userMessage);
    const phone = extractPhone(userMessage);

    if (email || phone) {
      await Lead.create({
        email,
        phone,
        notes: userMessage,
        source: "chat-widget",
        device,
        workspace: agent.workspace,
      });
    }

    return withCORS({ reply }, 200);
  } catch (error) {
    console.error("API error:", error);
    return withCORS({ reply: "Something went wrong." }, 500);
  }
}

// --- OPTIONS handler ---
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
