"use client";

import { Loader2, MessagesSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "@/hooks/use-chat-messages";
import { useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { SvgViewer } from "../svg-viewer";
interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="pt-[20dvh] flex flex-col items-center justify-center text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-500">
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
            "flex animate-in fade-in slide-in-from-bottom-40 duration-1000",
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
                <SvgViewer
                  url={message.svgUrl || "/placeholder.svg"}
                  className="w-full h-full"
                />
              </div>
            ) : (
              <p
                onClick={() => {
                  navigator.clipboard.writeText(message.content);
                  toast({
                    title: "Скопійовано",
                    description: `Текст "${message.content}" був скопійований в буфер обміну`,
                  });
                }}
              >
                {message.content}
              </p>
            )}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-center items-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
