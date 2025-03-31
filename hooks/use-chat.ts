"use client";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useChatMessages } from "./use-chat-messages";
import { generateSVG } from "@/lib/generator";
import { useSupabase } from "@/components/supabase-provider";

export function useChat() {
  const { messages = [], addMessage, clearMessages } = useChatMessages();
  const [input, setInput] = useState("");
  const [style, setStyle] = useState("FLAT_VECTOR");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { supabase } = useSupabase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      content: input,
    };

    addMessage(userMessage);
    setInput("");
    setIsLoading(true);

    try {
      const response = await generateSVG(input, style, imageUrl, supabase);

      addMessage({
        id: response.id,
        type: "svg",
        content: input,
        svgUrl: response.svgUrl,
      });

      setImageUrl(null);
    } catch (error) {
      setInput(userMessage.content);

      addMessage({
        id: `error-${Date.now()}`,
        type: "system",
        content: `Помилка: ${
          error instanceof Error
            ? error.message
            : "Не вдалося згенерувати SVG. Будь ласка, спробуйте ще раз."
        }`,
      });

      toast({
        title: "Помилка",
        description:
          error instanceof Error
            ? error.message
            : "Не вдалося згенерувати SVG. Будь ласка, спробуйте ще раз.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    afterFileLoad?: () => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Недійсний файл",
        description: "Будь ласка, завантажте зображення",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUrl(event.target?.result as string);
      afterFileLoad?.();
    };
    reader.readAsDataURL(file);
  };

  return {
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
    clearChat: clearMessages,
  };
}
