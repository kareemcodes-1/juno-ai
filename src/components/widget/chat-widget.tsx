"use client";
import React, { useState } from "react";
import { Bot, Mail, MessageCircle, MessageSquare, X } from "lucide-react";
import Image from "next/image";

type Message = {
  role: "user" | "bot";
  content: string;
};

type ChatWidgetProps = {
  name: string;
  role: string;
  label: string;
  placeholder: string;
  accentColor: string;
  icon?: string;
  welcomeMessage: string;
  logo?: string | null; // ✅ new
  position?: "bottom-right" | "bottom-left"; // ✅ new
};

const ChatWidget = ({
  label,
  placeholder,
  accentColor,
  icon,
  welcomeMessage,
  logo,
  position = "bottom-right",
}: ChatWidgetProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: welcomeMessage || "Hi, How can I help you today?" },
  ]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (data: FormData) => {
    const message = data.get("message") as string;
    if (!message.trim()) return;

    setMessages([...messages, { role: "user", content: message }]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "This is a dummy response. (AI coming soon!)" },
      ]);
    }, 1000);
  };

  // Position classes
  const positionClass =
    position === "bottom-left" ? "bottom-6 left-6" : "bottom-6 right-6";

  return (
    <div>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed ${positionClass} p-4 rounded-full shadow-lg cursor-pointer  z-[100]`}
          style={{ backgroundColor: accentColor }}
        >
          {icon === "bot" && <Bot color="#fff" size={28} />}
          {icon === "mail" && <Mail color="#fff" size={28} />}
          {icon === "message-square" && <MessageSquare color="#fff" size={28} />}
          {icon === "message-circle" && (
            <MessageCircle color="#fff" size={28} />
          )}
        </button>
      )}

      {/* Chat Box */}
      {isOpen && (
        <div
          className={`fixed ${positionClass} w-80 h-[500px] flex flex-col border rounded-2xl shadow-lg bg-white z-[100]`}
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
                  width={500}
                  height={500}
                  quality={100}
                  alt="Agent Logo"
                  className="w-7 h-7 rounded-full border"
                />
              )}
              <span>{label || "Support Bot"}</span>
            </div>
            <button className="cursor-pointer" onClick={() => setIsOpen(false)}>
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
                  <>
                    {logo ? (
                      <Image
                      width={500}
                      height={500}
                      quality={100}
                        src={logo}
                        alt="Bot Avatar"
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <Bot size={20} />
                    )}
                  </>
                )}
                <div
                  className={`p-2 rounded-lg break-words max-w-[70%] ${
                    m.role === "user"
                      ? "text-white"
                      : "text-black bg-gray-100"
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
          </div>

          {/* Input Form */}
          <form action={handleSubmit} className="flex border-t p-2">
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
    </div>
  );
};

export default ChatWidget;
