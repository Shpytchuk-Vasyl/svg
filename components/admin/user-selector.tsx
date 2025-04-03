"use client";

import { Label } from "@/components/ui/label";
import { useAdminContext } from "@/providers/admin";
import { UserMetadata } from "@supabase/supabase-js";
import { MultiSelect } from "./multi-select";

export function UsersSelector({ users }: { users: UserMetadata[] }) {
  const { userIds, setUserIds } = useAdminContext();
  console.log(users);
  // Створюємо опції для MultiSelect
  const options = [
    { value: "all", label: "Всі користувачі" },
    ...users.map((user) => ({
      value: user.id,
      label: user.name || user.email || user.id,
    })),
  ];

  // Обробник зміни вибору
  const handleSelectChange = (selected: string[]) => {
    if (selected.length === 0) {
      // Якщо нічого не вибрано, встановлюємо "all"
      setUserIds("all");
    } else {
      // Інакше встановлюємо масив ID користувачів
      setUserIds(selected);
    }
  };

  // Визначаємо поточний вибір для компонента
  const selectedValues = userIds === "all" ? [] : userIds;

  return (
    <div className="space-y-2">
      <Label htmlFor="recipient">Одержувачі</Label>
      <MultiSelect
        options={options}
        selected={selectedValues}
        onChange={handleSelectChange}
        placeholder="Виберіть одержувачів"
      />
    </div>
  );
}
