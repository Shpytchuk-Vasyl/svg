"use client";

import { useChat } from "@/hooks/use-chat";
import { ChatMessages } from "@/components/chat-messages";
import { ChatInput } from "@/components/chat-input";

export function ChatInterface() {
  const {
    messages,
    input,
    setInput,
    style,
    setStyle,
    imageUrl,
    setImageUrl,
    isLoading,
    handleSubmit,
    handleFileChange,
  } = useChat();

  return (
    <div className="grid grid-cols-1 grid-rows-[1fr_auto] h-full">
      <ChatMessages messages={messages} />
      <ChatInput
        input={input}
        setInput={setInput}
        style={style}
        setStyle={setStyle}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onFileChange={handleFileChange}
      />
    </div>
  );
}
