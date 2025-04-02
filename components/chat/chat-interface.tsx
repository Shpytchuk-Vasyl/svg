"use client";

import { useChat } from "@/hooks/use-chat";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";

export function ChatInterface() {
  const { handleSubmit, handleFileChange } = useChat();

  return (
    <>
      <ChatMessages />
      <ChatInput onSubmit={handleSubmit} onFileChange={handleFileChange} />
    </>
  );
}
