"use client";
import React, { useState } from "react";
import { Bot, Mail, MessageCircle, MessageSquare, X } from "lucide-react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { getSessionId } from "../../lib/session";

type Message = { role: "user" | "bot"; content: string };

type ChatWidgetProps = {
  name: string;
  role: string;
  agentId: string;
  userId: string;
  label: string;
  placeholder: string;
  accentColor: string;
  icon?: "bot" | "mail" | "message-square" | "message-circle";
  welcomeMessage: string;
  logo?: string | null;
  position?: "bottom-right" | "bottom-left";
  baseUrl: string;
};

const ChatWidget = ({
  agentId,
  userId,
  label,
  placeholder,
  accentColor,
  icon = "bot",
  welcomeMessage,
  logo,
  position = "bottom-right",
  baseUrl,
}: ChatWidgetProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: welcomeMessage || "Hi, how can I help you?" },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async (data: FormData) => {
    const message = data.get("message") as string;
    if (!message.trim()) return;

    const newMessages = [...messages, { role: "user", content: message }];
    setMessages([...messages, { role: "user", content: message }]);
    setIsTyping(true);

    try {
      const sessionId = getSessionId(userId);
      const res = await fetch(`${baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, sessionId, messages: newMessages }),
      });

      if (!res.ok) throw new Error("Failed to fetch reply");
      const { reply } = await res.json();
      setMessages((prev) => [...prev, { role: "bot", content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "⚠️ Error: could not reach support." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const positionClass =
    position === "bottom-left" ? "bottom-6 left-6" : "bottom-6 right-6";

  const widgetBox = (
    <>
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed ${positionClass} p-4 rounded-full shadow-lg cursor-pointer z-[999999]`}
          style={{ backgroundColor: accentColor }}
        >
          {icon === "bot" && <Bot color="#fff" size={28} />}
          {icon === "mail" && <Mail color="#fff" size={28} />}
          {icon === "message-square" && <MessageSquare color="#fff" size={28} />}
          {icon === "message-circle" && <MessageCircle color="#fff" size={28} />}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed ${positionClass} flex flex-col border rounded-2xl shadow-lg bg-white z-[1000000] animate-fadeIn`}
          style={{
            width: "min(90vw,400px)",
            height: "min(80vh,500px)",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          {/* Header */}
          <div
            className="flex justify-between items-center px-4 py-2 rounded-t-2xl text-white"
            style={{ backgroundColor: accentColor }}
          >
            <div className="flex items-center gap-2">
              {logo && (
                <Image
                  src={logo}
                  width={28}
                  height={28}
                  alt="Agent Logo"
                  className="w-7 h-7 rounded-full border"
                />
              )}
              <span>{label || "Support Bot"}</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="cursor-pointer">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role === "bot" && (
                  logo ? (
                    <Image
                      src={logo}
                      width={24}
                      height={24}
                      alt="Bot Avatar"
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <Bot size={20} />
                  )
                )}
                <div
                  className={`p-2 rounded-lg break-words max-w-[70%] ${
                    m.role === "user" ? "text-white" : "text-black bg-gray-100"
                  }`}
                  style={{
                    backgroundColor:
                      m.role === "user" ? accentColor : "#e5e7eb",
                  }}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="p-2 rounded-lg bg-gray-100 text-gray-500 italic">
                  Typing...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            action={handleSubmit}
            className="flex border-t p-2 shrink-0"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(new FormData(e.currentTarget));
              e.currentTarget.reset();
            }}
          >
            <input
              name="message"
              className="flex-1 border rounded-xl px-3 py-2 mr-2 outline-none"
              placeholder={placeholder || "Type a message..."}
            />
            <button
              type="submit"
              className="text-white px-4 py-2 rounded-xl cursor-pointer"
              style={{ backgroundColor: accentColor }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );

  return typeof document !== "undefined"
    ? createPortal(widgetBox, document.body)
    : null;
};

export default ChatWidget;
