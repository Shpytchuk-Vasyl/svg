"use client";

import { useState, useEffect } from "react";
import { subscribeUser, unsubscribeUser } from "@/app/actions";
import { BellRing, BellOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushNotificationManager() {
  const { toast } = useToast();
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      checkSubscription();
    }
  }, []);

  async function checkSubscription() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    } catch (error) {
      console.error("Error checking subscription:", error);
    }
  }

  async function subscribeToPush() {
    try {
      if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
        toast({
          title: "Помилка",
          description: "VAPID ключ не налаштований",
          variant: "destructive",
        });
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast({
          title: "Повідомлення вимкнені",
          description: "Дозвольте сповіщення в налаштуваннях браузера",
          variant: "destructive",
        });
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        ),
      });

      setSubscription(sub);
      await subscribeUser(JSON.parse(JSON.stringify(sub)));

      toast({
        title: "Підписка активована",
        description: "Тепер ви будете отримувати повідомлення",
      });
    } catch (error) {
      console.error("Error subscribing to push:", error);
      toast({
        title: "Помилка підписки",
        description: "Не вдалося підписатися на сповіщення",
        variant: "destructive",
      });
    }
  }

  async function unsubscribeFromPush() {
    try {
      if (!subscription) return;

      await subscription.unsubscribe();
      await unsubscribeUser(subscription.endpoint);

      setSubscription(null);

      toast({
        title: "Підписка скасована",
        description: "Ви більше не будете отримувати сповіщення",
      });
    } catch (error) {
      console.error("Error unsubscribing from push:", error);
      toast({
        title: "Помилка",
        description: "Не вдалося скасувати підписку",
        variant: "destructive",
      });
    }
  }

  if (!isSupported) {
    return (
      <DropdownMenuItem disabled className="text-muted-foreground">
        <BellOff className="h-4 w-4 mr-2" />
        Браузер не підтримує сповіщення
      </DropdownMenuItem>
    );
  }

  if (subscription) {
    return (
      <DropdownMenuItem onClick={unsubscribeFromPush}>
        <BellOff className="h-4 w-4 mr-2" />
        Відключити сповіщення
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem onClick={subscribeToPush}>
      <BellRing className="h-4 w-4 mr-2" />
      Увімкнути сповіщення
    </DropdownMenuItem>
  );
}
