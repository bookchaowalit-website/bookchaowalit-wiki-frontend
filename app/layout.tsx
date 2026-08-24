import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Field Manual | Bookchaowalit",
  description: "A read-only personal knowledge base backed by local MDX.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
