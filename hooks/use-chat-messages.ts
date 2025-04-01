"use client";
import { useState, useLayoutEffect } from "react";
import { GalleryImageType } from "./use-gallery-images";

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

export function useChatMessages() {
  const [messages, setMessages] = useState<Message[]>(getInitialMessages);

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

  return {
    messages,
    addMessage,
    clearMessages,
  };
}
