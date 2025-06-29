import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner"; 
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EmailSync AI",
  description: "EmailSync AI is an intelligent platform designed to automate and streamline your email processes, making inbox management smarter and more efficient."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* Add the Toaster component with your preferred configuration */}
        <Toaster 
          position="top-center"
          richColors
          closeButton
          toastOptions={{
            classNames: {
              toast: 'font-sans',
              title: 'font-medium',
              description: 'font-normal',
            },
          }}
        />
      </body>
    </html>
  );
}