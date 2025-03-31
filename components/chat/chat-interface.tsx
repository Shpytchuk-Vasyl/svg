"use client";

import { useChat } from "@/hooks/use-chat";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";

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
    clearChat,
  } = useChat();

  return (
    <>
      <ChatMessages messages={messages} isLoading={isLoading} />
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
        onClearChat={clearChat}
      />
    </>
  );
}
