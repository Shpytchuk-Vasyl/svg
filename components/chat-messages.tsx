"use client";

import { MessagesSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "@/hooks/use-chat";
import { useEffect, useRef } from "react";

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-500">
        <MessagesSquare className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">
          Опишіть що ви хочете намалювати...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex animate-in fade-in slide-in-from-bottom-2 duration-300",
            message.type === "user" ? "justify-end" : "justify-start"
          )}
        >
          <div
            className={cn(
              "rounded-lg p-3 max-w-[80%]",
              message.type === "user"
                ? "bg-primary text-primary-foreground"
                : message.type === "svg"
                ? "bg-background border"
                : message.content.startsWith("Error:")
                ? "bg-destructive/10 text-destructive border border-destructive/20"
                : "bg-muted"
            )}
          >
            {message.type === "svg" ? (
              <div className="space-y-2">
                <p className="text-sm">{message.content}</p>
                <div className="relative aspect-square w-full bg-background/50 rounded overflow-hidden">
                  <img
                    src={message.svgUrl || "/placeholder.svg"}
                    alt={message.content}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ) : (
              <p>{message.content}</p>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
