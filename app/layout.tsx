import type { Metadata } from "next";

import NavBar from "@/components/NavBar";
import "./globals.css";
import { getSession } from '@/lib/session';
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Quiz App",
  description: "Users can take quizzes and test their knowledge.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <SessionProvider session={session}>
          <NavBar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
