"use client";

import { useRef, useState } from "react";
import { ImagePlus, Send, Loader2, Plus, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const STYLES = [
  { value: "FLAT_VECTOR", label: "Плоский вектор" },
  { value: "FLAT_VECTOR_OUTLINE", label: "Контурний вектор" },
  { value: "FLAT_VECTOR_SILHOUETTE", label: "Силует" },
  { value: "FLAT_VECTOR_ONE_LINE_ART", label: "Один лінійний вектор" },
  { value: "FLAT_VECTOR_LINE_ART", label: "Лінійний вектор" },
];

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  style: string;
  setStyle: (value: string) => void;
  imageUrl: string | null;
  setImageUrl: (value: string | null) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    afterFileLoad: () => void
  ) => void;
  onClearChat: () => void;
}

export function ChatInput({
  input,
  setInput,
  style,
  setStyle,
  imageUrl,
  setImageUrl,
  isLoading,
  onSubmit,
  onFileChange,
  onClearChat,
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const afterFileLoad = () => {
    setIsPopoverOpen(false);
  };

  return (
    <div className="sticky inset-x-0 bottom-0 bg-gradient-to-t from-background to-background/0 pt-4">
      <div className="mx-auto max-w-4xl">
        {imageUrl && (
          <div className="mb-4 relative size-16 rounded-lg overflow-hidden border animate-in zoom-in duration-300">
            <img
              src={imageUrl}
              alt="Upload preview"
              className="w-full h-full object-cover"
            />
            <Button
              onClick={() => setImageUrl(null)}
              className="size-4 absolute top-1 right-1 p-2"
              variant="outline"
            >
              <X className="size-2" />
            </Button>
          </div>
        )}

        <div className="relative flex items-center rounded-lg border bg-background shadow-lg min-h-10 p-2">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-full rounded-l-lg hover:bg-muted size-8 p-3"
              >
                <Plus className="text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start" side="top">
              <div className="space-y-2">
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Виберіть стиль" />
                  </SelectTrigger>
                  <SelectContent>
                    {STYLES.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Завантажити зображення
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={onClearChat}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Очистити чат
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <form onSubmit={onSubmit} className="flex-1 flex items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Опишіть що ви хочете намалювати..."
              disabled={isLoading}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="rounded-r-lg size-8 p-3"
            >
              {isLoading ? (
                <Loader2 className=" animate-spin" />
              ) : (
                <Send className="" />
              )}
            </Button>
          </form>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => onFileChange(e, afterFileLoad)}
            className="hidden"
          />
        </div>
        <div className="text-xs text-center mt-2 text-muted-foreground">
          Натисніть + щоб вибрати стиль або завантажити зображення
        </div>
      </div>
    </div>
  );
}
