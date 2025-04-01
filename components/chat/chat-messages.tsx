"use client";

import { Loader2, MessagesSquare, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "@/hooks/use-chat-messages";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { SvgViewer } from "../svg-viewer";
import { SVGViewerModal } from "../svg/svg-modal";
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
              <SVG message={message} />
            ) : (
              <p
                onClick={() => {
                  navigator.clipboard.writeText(message.content);
                  toast({
                    title: "Скопійовано",
                    description: `Текст "${message.content}" був скопійований в буфер обміну`,
                    variant: "default",
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

const SVG = ({ message }: { message: Message }) => {
  const [key, setKey] = useState(1);
  const [isSelected, setIsSelected] = useState(false);
  console.log(message);
  return (
    <div className="cursor-pointer" onClick={() => setIsSelected(true)}>
      <p className="relative">
        <RotateCw
          className="w-4 h-4 absolute top-4 right-4"
          onClick={() => {
            setKey(key + 1);
          }}
        />
      </p>
      <SvgViewer
        reload={key}
        url={message.image?.svg_url || "/placeholder.svg"}
        className="w-full h-full"
      />
      <SVGViewerModal
        isUserGallery={false}
        isSelected={isSelected}
        setIsSelected={setIsSelected}
        image={message.image!}
        setReloadTriger={setKey}
        reloadTriger={key}
      />
    </div>
  );
};
