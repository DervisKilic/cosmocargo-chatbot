"use client";

import React, { useEffect, useRef, useState } from "react";
import { askChat } from "@/services/chat-service";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

type ChatMessage = {
  id: string;
  role: "user" | "bot";
  content: string;
};

function RobotIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="7" width="14" height="10" rx="5" />
        <circle cx="9" cy="12" r="1.2" />
        <circle cx="15" cy="12" r="1.2" />
        <path d="M10 15c1 1 3 1 4 0" />
        <path d="M12 6V4" />
        <circle cx="12" cy="3" r="1" />
      </g>
    </svg>
  );
}

export default function ChatbotButton() {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const isRootOrLogin = pathname === "/" || pathname.startsWith("/login");
  const hideForRole = isAuthenticated && user?.role !== "customer";
  const shouldHide = isRootOrLogin || hideForRole;

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m0",
      role: "bot",
      content:
        "Hej! Jag är Intergalactic AI Support-bot. Ställ en fråga om dina frakter. Jag svarar även på frågor om formulär eller regler.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open, isLoading]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2),
        role: "user",
        content: text.trim(),
      },
    ]);
    setInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input;
    sendMessage(text);
    setIsLoading(true);
    const history = messages.concat({
      id: "tmp",
      role: "user" as const,
      content: text,
    });
    const mapped = history.map((m) => ({
      role: m.role === "bot" ? ("assistant" as const) : (m.role as "user"),
      content: m.content,
    }));
    try {
      const reply = await askChat(mapped);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).slice(2),
          role: "bot",
          content: reply || "",
        },
      ]);
    } catch (err) {
      const e = err as unknown;
      const msg =
        e instanceof Error &&
        typeof e.message === "string" &&
        e.message.trim().length > 0
          ? e.message
          : "Kunde inte hämta svar just nu. Försök igen senare.";
      setMessages((prev) => [
        ...prev,
        { id: Math.random().toString(36).slice(2), role: "bot", content: msg },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return shouldHide ? null : (
    <>
      {!open && (
        <button
          type="button"
          aria-label="Öppna chat"
          aria-expanded={open}
          aria-controls="chatbot-panel"
          title="Chatbot"
          onClick={() => setOpen(true)}
          className="fixed z-40 sm:bottom-6 sm:right-6 bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-3 rounded-full bg-space-secondary/90 hover:bg-space-secondary p-3 sm:p-4 shadow-xl backdrop-blur pointer-events-auto text-white inline-flex items-center gap-2"
        >
          <RobotIcon className="h-6 w-6 sm:h-7 sm:w-7" />
          <span className="hidden sm:inline">Fråga</span>
        </button>
      )}

      <div
        id="chatbot-panel"
        aria-hidden={!open}
        className={`fixed z-40 sm:bottom-6 sm:right-6 bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-3 sm:w-[380px] w-[calc(100vw-1.5rem)] overflow-hidden sm:rounded-xl rounded-lg border border-space-secondary/50 bg-space-primary/95 text-space-text-primary shadow-2xl backdrop-blur transition-all duration-300 origin-bottom-right ${
          open
            ? "opacity-100 scale-100"
            : "pointer-events-none opacity-0 scale-90"
        }`}
      >
        <div className="flex items-center gap-3 bg-space-secondary text-white px-3 sm:px-4 py-3">
          <RobotIcon className="h-7 w-7 sm:h-8 sm:w-8" />
          <div className="flex-1 leading-tight">
            <div className="font-semibold">Intergalactic AI Support-bot</div>
            <div className="text-xs opacity-80">
              Ställ en fråga i textfältet nedan
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Stäng chat"
            className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div
          ref={scrollRef}
          role="log"
          aria-live="polite"
          className="sm:max-h-[60vh] max-h-[80vh] sm:min-h-[300px] min-h-[50vh] overflow-y-auto px-3 sm:px-4 py-3 space-y-3"
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                  m.role === "user"
                    ? "bg-space-accent-purple/90 text-white rounded-br-sm"
                    : "bg-space-primary/80 border border-space-secondary/50 rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-t border-space-secondary/40 p-3 bg-space-primary/95"
        >
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Skriv din fråga här..."
              className="flex-1 rounded-full bg-space-primary/80 border border-space-secondary text-white placeholder:text-space-text-secondary/80 px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-space-accent-purple/40"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-button-gradient text-white shadow hover:opacity-90 disabled:opacity-60 flex-shrink-0"
              aria-label="Skicka"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg
                  className="h-5 w-5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                >
                  <path d="M3.4 20.6L21 12 3.4 3.4 4.9 11l9.6 1-9.6 1z" />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
