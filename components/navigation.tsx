"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Image, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Головна",
      href: "/",
      icon: Home,
      active: pathname === "/",
    },
    {
      name: "Галерея",
      href: "/gallery",
      icon: Image,
      active: pathname === "/gallery",
    },
    {
      name: "Мої",
      href: "/my-images",
      icon: User,
      active: pathname === "/my-images",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="container max-w-md mx-auto">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center py-2 px-3 text-sm",
                item.active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
