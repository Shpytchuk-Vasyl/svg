import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function AdminPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Link href="/admin/notification">Notification</Link>
        <Link href="/admin/gallery">Gallery</Link>
      </CardContent>
    </Card>
  );
}
