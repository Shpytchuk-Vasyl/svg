"use client";
import { generateSVG } from "@/third-party/generator";
import { useToast } from "@/hooks/use-toast";
import { useChatMessages } from "@/providers/chat-messages";
import { useSupabase } from "@/providers/supabase-provider";

export function useChat() {
  const {
    addMessage,
    input,
    setInput,
    style,
    imageUrl,
    setImageUrl,
    isLoading,
    setIsLoading,
  } = useChatMessages();
  const { toast } = useToast();
  const { supabase } = useSupabase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      content: input,
      created_at: new Date().toISOString(),
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
        image: response,
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
    handleSubmit,
    handleFileChange,
  };
}
