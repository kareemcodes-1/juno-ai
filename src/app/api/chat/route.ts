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


// Role-based templates
const roleInstructions: Record<string, string> = {
  "sales-agent": `...`,
  "customer-support": `...`,
  "faq-agent": `...`,
};

// Simple regex extractors
function extractEmail(text: string): string | null {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : null;
}

function extractPhone(text: string): string | null {
  const match = text.match(/(\+?\d{1,3}[-.\s]?)?\d{7,14}/);
  return match ? match[0] : null;
}

export async function POST(req: Request) {
  await connectDB();
  const { messages, agentId, sessionId, device = "unknown" } = await req.json();

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

  // Pick template based on role
  const template =
    roleInstructions[agent.role] || roleInstructions["sales-agent"];

  // Fill placeholders
  const instruction = template
    .replace(/{{agentName}}/g, agent.name)
    .replace(/{{businessName}}/g, agent.business || "our business")
    .replace(/{{businessInfo}}/g, agent.instructions)
    .replace(/{{ownerName}}/g, ownerName)
    .replace(/{{ownerEmail}}/g, ownerEmail);

  const prompt = `
${instruction}

Rules:
- Never mention you are an AI, Google, or LLM.
- Always stay in character as the role assigned.
- Always reply in a professional, business-focused tone.

User: ${userMessage}
Assistant:
`;

  const result = await model.generateContent(prompt);
  const reply = result.response.text();

  // --- Store messages in Chat collection ---
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
}

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
