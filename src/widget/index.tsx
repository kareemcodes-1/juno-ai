import { useState } from "react";
import { createRoot } from "react-dom/client";
import { Bot, Mail, MessageCircle, MessageSquare, X } from "lucide-react";
import { getSessionId } from "../lib/session";

type Message = {
  role: "user" | "bot";
  content: string;
};

type AgentConfig = {
  _id: string;
  user: string;
  name: string;
  role: string;
  label: string;
  placeholder: string;
  accentColor: string;
  icon?: "bot" | "mail" | "message-square" | "message-circle";
  welcomeMessage: string;
};

const ChatWidget = ({ agent, baseUrl }: { agent: AgentConfig, baseUrl: string }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: agent.welcomeMessage || "Hi, how can I help you?" },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // typing indicator

const handleSubmit = async (data: FormData) => {
  const message = data.get("message") as string;
  if (!message.trim()) return;

  const newMessages = [...messages, { role: "user", content: message }];
  setMessages([...messages, { role: "user", content: message }]);

  setIsTyping(true);

  try {

    const sessionId = getSessionId(agent.user);

    

    const res = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agentId: agent._id,
        sessionId: sessionId, // ✅ add session
        messages: newMessages,
      }),
    });

    const { reply } = await res.json();
    setMessages((prev) => [...prev, { role: "bot", content: reply }]);
  } catch (error) {
    console.error(error);
    setMessages((prev) => [
      ...prev,
      { role: "bot", content: "⚠️ Error: could not reach support." },
    ]);
  } finally {
    setIsTyping(false);
  }
};


  return (
    <div style={{ fontFamily: "Cabinet Grotesk, sans-serif", fontWeight: "500" }}>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            padding: "16px",
            borderRadius: "50%",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            cursor: "pointer",
            backgroundColor: agent.accentColor,
            border: "none",
           zIndex: 999999,
           fontFamily: "Cabinet Grotesk, sans-serif",
          }}
        >
          {agent.icon === "bot" && <Bot color="#fff" size={28} />}
          {agent.icon === "mail" && <Mail color="#fff" size={28} />}
          {agent.icon === "message-square" && (
            <MessageSquare color="#fff" size={28} />
          )}
          {agent.icon === "message-circle" && (
            <MessageCircle color="#fff" size={28} />
          )}
        </button>
      )}

      {/* Chat Box */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "320px",
            height: "500px",
            display: "flex",
            flexDirection: "column",
            border: "1px solid #ccc",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            backgroundColor: "#fff",
            overflow: "hidden",
            fontFamily: "Cabinet Grotesk, sans-serif",
            zIndex: 999999,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 16px",
              backgroundColor: agent.accentColor,
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            <span>{agent.label || "Support Bot"}</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#fff",
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  backgroundColor:
                    m.role === "user" ? agent.accentColor : "#e5e7eb",
                  color: m.role === "user" ? "#fff" : "#000",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  maxWidth: "70%",
                  wordWrap: "break-word",
                  fontFamily: "Cabinet Grotesk, sans-serif",
                }}
              >
                {m.content}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: "#e5e7eb",
                  color: "#000",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  maxWidth: "50%",
                  fontStyle: "italic",
                  fontFamily: "Cabinet Grotesk, sans-serif",
                }}
              >
                Typing<span className="dots">...</span>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(new FormData(e.currentTarget));
              e.currentTarget.reset();
            }}
            style={{
              display: "flex",
              borderTop: "1px solid #eee",
              padding: "8px",
            }}
          >
            <input
              name="message"
              placeholder={agent.placeholder || "Type a message..."}
              style={{
                flex: 1,
                border: "1px solid #ccc",
                borderRadius: "12px",
                padding: "8px 12px",
                marginRight: "8px",
                outline: "none",
                fontFamily: "Cabinet Grotesk, sans-serif",
                fontWeight: "500"
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: agent.accentColor,
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                padding: "8px 16px",
                cursor: "pointer",
                fontFamily: "Cabinet Grotesk, sans-serif",
                fontWeight: "500",
                zIndex: 999999,
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

(function () {
  // Create host container
  const host = document.createElement("div");
  host.id = "juno-widget-host";
  host.style.position = "fixed";
  host.style.bottom = "24px";
  host.style.right = "24px";
  host.style.zIndex = "2147483647"; // max safe value
  host.style.width = "0"; // we render inside shadow, so no size here
  host.style.height = "0";
  document.body.appendChild(host);

  // Attach shadow root (isolate styles)
  const shadow = host.attachShadow({ mode: "open" });

  // Real container inside shadow
  const appContainer = document.createElement("div");
  appContainer.id = "juno-widget-app";
  shadow.appendChild(appContainer);

  // Inject font (optional)
  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href =
    "https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@300,400,500,700,800,900&display=swap";
  shadow.appendChild(fontLink);

  // Pull data attributes from the script tag
  const currentScript = document.currentScript;
  const agentId = currentScript?.getAttribute("data-agent-id");
  const workspace = currentScript?.getAttribute("data-workspace-url");
  const baseUrl = currentScript?.getAttribute("data-base-url");

  if (!agentId || !workspace || !baseUrl) {
    console.error("Widget: missing data attributes");
    return;
  }

  // Fetch agent config and mount
  fetch(`${baseUrl}/api/workspace/${workspace}/agent/${agentId}`)
    .then((res) => res.json())
    .then((agent) => {
      const root = createRoot(appContainer);
      root.render(<ChatWidget agent={agent} baseUrl={baseUrl} />);
    })
    .catch((err) => {
      console.error("Widget: failed to load agent", err);
    });
})()

