"use server";

import { createServerClient } from "@/lib/supabase-server";
import webpush from "web-push";
webpush.setVapidDetails(
  "mailto:vasyl.shpytchuk.pz.2022@lpnu.ua",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function subscribeUser(sub: {
  endpoint: string;
  keys: {
    auth: string;
    p256dh: string;
  };
}) {
  try {
    const supabase = createServerClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      throw new Error("Користувач не авторизований");
    }

    const endpoint = sub.endpoint;
    const p256dh = sub.keys.p256dh;
    const auth = sub.keys.auth;

    // Шукаємо існуючу підписку з таким endpoint і user_id
    const { data: existingSubscription } = await supabase
      .from("push_subscriptions")
      .select()
      .eq("endpoint", endpoint)
      .eq("user_id", userId)
      .maybeSingle();

    // Якщо підписка вже існує, нічого не робимо
    if (existingSubscription) {
      return { success: true, message: "Підписка вже існує" };
    }

    // Створюємо нову підписку в базі даних
    const { error } = await supabase.from("push_subscriptions").insert({
      user_id: userId,
      endpoint: endpoint,
      auth: auth,
      p256dh: p256dh,
    });

    if (error) {
      console.error("Помилка при додаванні підписки:", error);
      throw new Error("Не вдалося зберегти підписку");
    }

    return { success: true };
  } catch (error) {
    console.error("Помилка при обробці підписки:", error);
    return { success: false, error };
  }
}

export async function unsubscribeUser(endpoint: string) {
  try {
    const supabase = createServerClient();

    // Отримуємо поточного користувача
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      throw new Error("Користувач не авторизований");
    }

    // Видаляємо підписку з бази даних
    const { error } = await supabase
      .from("push_subscriptions")
      .delete()
      .eq("endpoint", endpoint)
      .eq("user_id", userId);

    if (error) {
      console.error("Помилка при видаленні підписки:", error);
      throw new Error("Не вдалося видалити підписку");
    }

    return { success: true };
  } catch (error) {
    console.error("Помилка при відписці:", error);
    return { success: false, error };
  }
}

export async function sendNotification({
  message,
  targetUserIds,
  title,
}: {
  message: any;
  targetUserIds?: string[];
  title?: string;
}) {
  try {
    const supabase = createServerClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, error: "Користувач не авторизований" };
    }

    // Отримуємо підписки з бази даних
    let query = supabase.from("push_subscriptions").select("*");

    // Якщо вказаний конкретний користувач, фільтруємо тільки його підписки
    if (targetUserIds?.length) {
      query = query.in("user_id", targetUserIds);
    }

    const { data: subscriptionsData, error } = await query;

    if (error) {
      console.error("Помилка при отриманні підписок:", error);
      throw new Error("Не вдалося отримати підписки");
    }

    if (!subscriptionsData || subscriptionsData.length === 0) {
      throw new Error("Немає активних підписок");
    }

    // Формуємо об'єкти підписок у потрібному форматі
    const subscriptions = subscriptionsData.map((sub) => ({
      endpoint: sub.endpoint,
      keys: {
        auth: sub.auth,
        p256dh: sub.p256dh,
      },
    }));

    const payload = JSON.stringify({
      title: title || "Love You - Повідомлення",
      body: message,
      icon: "/logo.svg",
    });

    const results = await Promise.all(
      subscriptions.map(async (subscription) => {
        try {
          await webpush.sendNotification(subscription, payload);
          return { success: true, endpoint: subscription.endpoint };
        } catch (error) {
          console.error("Помилка відправки push-повідомлення:", error);

          if ((error as any).statusCode === 410) {
            await supabase
              .from("push_subscriptions")
              .delete()
              .eq("endpoint", subscription.endpoint);
          }

          return { success: false, error, endpoint: subscription.endpoint };
        }
      })
    );

    return {
      success: true,
      results,
      sent: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
    };
  } catch (error) {
    console.error("Помилка при відправці повідомлень:", error);
    return { success: false, error };
  }
}
