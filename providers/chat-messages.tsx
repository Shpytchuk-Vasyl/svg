"use client";
import { GalleryImageType } from "@/hooks/use-gallery-images";
import { useState, useLayoutEffect, createContext, useContext } from "react";

export type Message = {
  id: string;
  type: "system" | "user" | "svg";
  content: string;
  image?: GalleryImageType;
};

type ChatStorage = {
  messages: Message[];
  lastMessageTimestamp: number;
};

export const STORAGE_KEY = "chat_messages_v1";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function getInitialMessages() {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  const data = JSON.parse(stored) as ChatStorage;
  const now = Date.now();

  // Очищаємо чат, якщо пройшло більше доби
  if (now - data.lastMessageTimestamp > ONE_DAY_MS) {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }

  return data.messages || [];
}

export type ChatMessageContextType = {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  input: string;
  setInput: (input: string) => void;
  style: string;
  setStyle: (style: string) => void;
  imageUrl: string | null;
  setImageUrl: (imageUrl: string | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

const ChatMessageContext = createContext<ChatMessageContextType>({
  messages: [],
  addMessage: () => {},
  clearMessages: () => {},
  input: "",
  setInput: () => {},
  style: "FLAT_VECTOR",
  setStyle: () => {},
  imageUrl: null,
  setImageUrl: () => {},
  isLoading: false,
  setIsLoading: () => {},
});

export function ChatMessageProvider({ children }: React.PropsWithChildren) {
  const [messages, setMessages] = useState<Message[]>(getInitialMessages);
  const [input, setInput] = useState("");
  const [style, setStyle] = useState("FLAT_VECTOR");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    if (messages.length > 0) {
      const storage: ChatStorage = {
        messages,
        lastMessageTimestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [messages]);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatMessageContext.Provider
      value={{
        messages,
        addMessage,
        clearMessages,
        input,
        setInput,
        style,
        setStyle,
        imageUrl,
        setImageUrl,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </ChatMessageContext.Provider>
  );
}

export const useChatMessages = () => {
  return useContext(ChatMessageContext);
};
