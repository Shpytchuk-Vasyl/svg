import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createAdminClient } from "@/lib/supabase-server";
import { UsersSelector } from "@/components/admin/user-selector";
import { NotificationTypeSelector } from "@/components/admin/type-selector";
import { SendButton } from "@/components/admin/send-button";
import { MessageFields } from "@/components/admin/message-fields";
import AdminProvider from "@/providers/admin";

export default async function NotificationDashboard() {
  const supabase = createAdminClient();

  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error("Помилка отримання користувачів:", error);
  }

  return (
    <AdminProvider>
      <Card className="w-full max-w-3xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Надсилання push-повідомлень</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <UsersSelector users={users || []} />

              <NotificationTypeSelector />
            </div>

            <MessageFields />
          </div>
        </CardContent>
        <CardFooter>
          <SendButton />
        </CardFooter>
      </Card>
    </AdminProvider>
  );
}
