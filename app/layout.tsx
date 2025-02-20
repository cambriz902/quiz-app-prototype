import type { Metadata } from "next";

import NavBar from "@/components/NavBar";
import "./globals.css";
import { NextAuthProvider } from './providers';

export const metadata: Metadata = {
  title: "Quiz App",
  description: "Users can take quizzes and test their knowledge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <NextAuthProvider>
          <NavBar />
          {children}  
        </NextAuthProvider>
      </body>
    </html>
  );
}
