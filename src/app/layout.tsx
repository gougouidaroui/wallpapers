import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wallpapers",
  description: "This is a app to learn how to make a efficient image library and learn more about images",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
