"use client";
import { createContext, useContext, useState } from "react";
import { Message } from "@/providers/chat-messages";

// Типи повідомлень
export enum NotificationType {
  ADD_TO_CHAT = "add_to_chat",
  GENERAL = "general",
}

export type NotificationPayload = {
  type: NotificationType;
  message: Message[] | string;
};

const AdminContext = createContext<
  NotificationPayload & {
    setPayload: React.Dispatch<React.SetStateAction<NotificationPayload>>;
    userIds: string[];
    setUserIds: React.Dispatch<React.SetStateAction<string[]>>;
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
  }
>({
  type: NotificationType.GENERAL,
  message: [] as any,
  setPayload: () => {},
  userIds: [],
  setUserIds: () => {},
  title: "",
  setTitle: () => {},
});

export default function AdminProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [payload, setPayload] = useState<NotificationPayload>({
    type: NotificationType.GENERAL,
    message: "",
  });
  const [userIds, setUserIds] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");
  return (
    <AdminContext.Provider
      value={{
        ...payload,
        setPayload,
        userIds,
        setUserIds,
        title,
        setTitle,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminContext() {
  return useContext(AdminContext);
}
