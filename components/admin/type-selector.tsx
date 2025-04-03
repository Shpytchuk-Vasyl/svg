"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NotificationType, useAdminContext } from "@/providers/admin";
import { Message } from "@/providers/chat-messages";

export function NotificationTypeSelector() {
  const { type, setPayload } = useAdminContext();

  const handleTypeChange = (value: string) => {
    if (value === NotificationType.GENERAL) {
      setPayload({
        type: NotificationType.GENERAL,
        message: "",
      });
    } else if (value === NotificationType.ADD_TO_CHAT) {
      // Створюємо порожній масив повідомлень для чату
      const emptyMessages: Message[] = [];
      setPayload({
        type: NotificationType.ADD_TO_CHAT,
        message: emptyMessages,
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="notificationType">Тип повідомлення</Label>
      <Select value={type} onValueChange={handleTypeChange}>
        <SelectTrigger>
          <SelectValue placeholder="Виберіть тип повідомлення" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NotificationType.GENERAL}>Загальне</SelectItem>
          <SelectItem value={NotificationType.ADD_TO_CHAT}>
            Додати в чат
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
