import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export type Message = {
  id: string;
  type: "system" | "user" | "svg";
  content: string;
  svgUrl?: string;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [style, setStyle] = useState("FLAT_VECTOR");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-svg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
          style,
          imageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate SVG");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: data.id,
          type: "svg",
          content: input,
          svgUrl: data.svgUrl,
        },
      ]);

      setImageUrl(null);
    } catch (error) {
      console.error("Error generating SVG:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          type: "system",
          content: `Помилка: ${
            error instanceof Error
              ? error.message
              : "Не вдалося згенерувати SVG. Будь ласка, спробуйте ще раз."
          }`,
        },
      ]);

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
    afterFileLoad: () => void
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
      afterFileLoad();
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
  };
}
