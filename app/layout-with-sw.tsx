import type React from "react";
import type { Metadata } from "next";
import RegisterServiceWorker from "./register-sw";

import Layout, { metadata as layoutMetadata } from "./layout";

export const metadata: Metadata = layoutMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout worker={<RegisterServiceWorker />}>{children}</Layout>;
}
