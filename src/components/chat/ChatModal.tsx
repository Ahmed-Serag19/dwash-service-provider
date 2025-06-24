"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { X, Send, Loader2, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useServiceProviderChat } from "@/hooks/useChat";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: number;
  customerName: string;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  requestId,
  customerName,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const { messages, status, error, subscribed, sendMessage, retry } =
    useServiceProviderChat(requestId);

  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      <div className="bg-white rounded-lg w-full max-w-md h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-green-600 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} />
            <h3 className="text-lg font-bold">
              {t("chatWith", { defaultValue: "Chat with" })} {customerName}
            </h3>
          </div>
          <button onClick={onClose} className="hover:bg-green-700 p-1 rounded">
            <X size={24} />
          </button>
        </div>

        {/* Connection Status */}
        {status === "connecting" && (
          <div className="p-2 bg-yellow-100 text-yellow-800 text-center text-sm">
            <Loader2 className="inline-block animate-spin mr-2" size={16} />
            {t("connecting", { defaultValue: "Connecting..." })}
          </div>
        )}

        {/* Error + Retry */}
        {error && (
          <div className="p-2 bg-red-100 text-red-800 text-center text-sm">
            {error}{" "}
            <button onClick={retry} className="underline hover:no-underline">
              {t("retry", { defaultValue: "Retry" })}
            </button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 flex flex-col items-center gap-2 mt-8">
              <MessageCircle size={48} className="text-gray-300" />
              <p>{t("noMessages", { defaultValue: "No messages yet." })}</p>
              <p className="text-sm">
                {t("startConversation", {
                  defaultValue: "Start the conversation!",
                })}
              </p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-4 ${
                  msg.messageSender === "FREELANCER"
                    ? "text-right"
                    : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg max-w-[80%] ${
                    msg.messageSender === "FREELANCER"
                      ? "bg-green-600 text-white rounded-tr-none"
                      : "bg-gray-200 text-gray-800 rounded-tl-none"
                  }`}
                >
                  {msg.message}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(msg.createdOn || "").toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t flex items-center" dir="ltr">
          <textarea
            rows={2}
            className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            placeholder={
              status !== "connected" || !subscribed
                ? t("waiting", { defaultValue: "Waiting..." })
                : t("typeMessage", { defaultValue: "Type a message..." })
            }
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={status !== "connected" || !subscribed}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (draft.trim()) {
                  sendMessage(draft);
                  setDraft("");
                }
              }
            }}
          />
          <button
            onClick={() => {
              if (draft.trim()) {
                sendMessage(draft);
                setDraft("");
              }
            }}
            disabled={!draft.trim() || status !== "connected" || !subscribed}
            className={`px-4 py-2 rounded-r-lg h-full transition-colors ${
              !draft.trim() || status !== "connected" || !subscribed
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
