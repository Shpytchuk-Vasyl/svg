"use client";

import { Loader2, MessagesSquare, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message, useChatMessages } from "@/providers/chat-messages";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { SvgViewer } from "../svg/svg-viewer";
import { SVGViewerModal } from "../svg/svg-modal";
import { copyToClipboard } from "@/lib/navigator-utils";

export function ChatMessages() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading } = useChatMessages();
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="pt-[20dvh] flex flex-col items-center justify-center text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-500">
        <MessagesSquare className="h-12 w-12 mb-4 animate-pulse" />
        <p className="text-lg font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          Опишіть що ви хочете намалювати...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={cn(
            "flex animate-in fade-in duration-700",
            message.type === "user"
              ? "justify-end slide-in-from-right-8"
              : "justify-start slide-in-from-left-8",
            index === messages.length - 1 && "delay-100"
          )}
        >
          <div
            className={cn(
              "rounded-lg p-3 max-w-[80%] transition-all hover:shadow-md",
              message.type === "user"
                ? "bg-primary text-primary-foreground"
                : message.type === "svg"
                ? "bg-background border hover:border-primary/50"
                : message.content.startsWith("Error:")
                ? "bg-destructive/10 text-destructive border border-destructive/20"
                : "bg-muted hover:bg-muted/80"
            )}
          >
            {message.type === "svg" ? (
              <SVG message={message} />
            ) : (
              <p
                className="cursor-pointer transition-colors hover:text-primary-foreground/90"
                onClick={() => {
                  copyToClipboard(message.content, toast);
                }}
              >
                {message.content}
              </p>
            )}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-center items-center py-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-muted p-3 rounded-full">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

const SVG = ({ message }: { message: Message }) => {
  const [key, setKey] = useState(1);
  const [isSelected, setIsSelected] = useState(false);
  return (
    <>
      <div className="cursor-pointer" onClick={() => setIsSelected(true)}>
        <p className="relative">
          <RotateCw
            className="w-4 h-4 absolute top-4 right-4"
            onClick={(e) => {
              e.stopPropagation();
              setKey(key + 1);
            }}
          />
        </p>
        <SvgViewer
          reload={key}
          url={message.image?.svg_url || "/placeholder.svg"}
          className="w-full h-full"
        />
      </div>
      <SVGViewerModal
        isUserGallery={false}
        isSelected={isSelected}
        setIsSelected={setIsSelected}
        image={message.image!}
        setReloadTriger={setKey}
        reloadTriger={key}
      />
    </>
  );
};
