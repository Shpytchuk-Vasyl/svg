"use client";

import { sendNotification } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { useAdminContext } from "@/providers/admin";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function SendButton() {
  const [loading, setLoading] = useState(false);
  const { type, message, title, userIds } = useAdminContext();
  const { toast } = useToast();

  const handleSendNotification = async () => {
    try {
      toast({
        title: "Надсилаємо повідомлення...",
      });
      setLoading(true);

      // Формуємо параметри для запиту в залежності від типу вибору користувачів
      const targetParams = userIds.length > 0 ? { targetUserIds: userIds } : {};

      const result = await sendNotification({
        message: {
          type,
          message,
        },
        title,
        ...targetParams,
      });

      if (result.success) {
        toast({
          title: `Повідомлення надіслано успішно! (Доставлено: ${
            result.sent
          }, Невдало: ${result.failed || 0})`,
        });
      } else {
        toast({
          title: `Помилка`,
          description: "Не вдалося відправити повідомлення",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Помилка відправки повідомлення:", error);
      toast({
        title: `Помилка`,
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSendNotification}
      disabled={!title || !message || loading}
      className="w-full"
    >
      {loading ? "Надсилаємо..." : "Надіслати повідомлення"}
    </Button>
  );
}
