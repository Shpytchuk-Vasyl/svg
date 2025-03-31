import type { Metadata } from "next";
import { ChatInterface } from "@/components/chat-interface";

export const metadata: Metadata = {
  title: "SVG Generator - Create",
  description: "Generate beautiful SVG images with AI",
};

export default function HomePage() {
  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-6">SVG для тебе</h1>
      <ChatInterface />
    </div>
  );
}
