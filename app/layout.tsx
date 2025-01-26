import type { Metadata } from "next";
import "./globals.css";


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
      <html lang="en">
        <body className="bg-white text-gray-900">{children}</body>
      </html>
    </html>
  );
}
