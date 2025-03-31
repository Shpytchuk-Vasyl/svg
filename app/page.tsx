import type { Metadata } from "next";
import { ChatInterface } from "@/components/chat-interface";
import { AuthButtonWrapper } from "@/components/auth-button-wrapper";
import Image from "next/image";
export const metadata: Metadata = {
  title: "Головна сторінка",
  description: "Головна сторінка, де ви можете створювати SVG для себе",
};

export default function HomePage() {
  return (
    <>
      <div className="flex justify-between items-center">
        <Image src="/logo.svg" alt="logo" width={40} height={40} />
        <AuthButtonWrapper />
      </div>
      <ChatInterface />
    </>
  );
}
