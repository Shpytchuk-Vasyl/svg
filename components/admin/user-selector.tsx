"use client";

import { Label } from "@/components/ui/label";
import { useAdminContext } from "@/providers/admin";
import { UserMetadata } from "@supabase/supabase-js";
import { MultiSelect } from "./multi-select";

export function UsersSelector({ users }: { users: UserMetadata[] }) {
  const { userIds, setUserIds } = useAdminContext();
  // Створюємо опції для MultiSelect
  const options = users.map((user) => ({
    value: user.id,
    label: user.name || user.email || user.id,
  }));

  return (
    <div className="space-y-2">
      <Label htmlFor="recipient">Одержувачі</Label>
      <MultiSelect
        options={options}
        selected={userIds}
        onChange={setUserIds}
        placeholder="Виберіть одержувачів"
      />
    </div>
  );
}
