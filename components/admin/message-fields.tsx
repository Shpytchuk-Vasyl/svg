"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NotificationType, useAdminContext } from "@/providers/admin";

export function MessageFields() {
  const { type, message, title, setPayload, setTitle } = useAdminContext();

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPayload((prev) => {
      if (prev.type === NotificationType.GENERAL) {
        return {
          ...prev,
          message: e.target.value,
        };
      }
      return prev;
    });
  };

  const messageText = typeof message === "string" ? message : "";

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Заголовок</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введіть заголовок повідомлення"
        />
      </div>

      {type === NotificationType.GENERAL && (
        <div className="space-y-2">
          <Label htmlFor="message">Текст повідомлення</Label>
          <Textarea
            id="message"
            value={messageText}
            onChange={handleMessageChange}
            placeholder="Введіть текст повідомлення"
            rows={3}
          />
        </div>
      )}

      {type === NotificationType.ADD_TO_CHAT && (
        <div className="space-y-2">
          <Label>Повідомлення для чату</Label>
          <p className="text-sm text-muted-foreground">
            Функціонал додавання повідомлень до чату в розробці
          </p>
        </div>
      )}
    </>
  );
}
