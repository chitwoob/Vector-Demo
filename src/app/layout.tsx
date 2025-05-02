import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import Header from "./header";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "Vector Demo",
  icons: [{ rel: "icon", url: "/favicon.webp" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          <Toaster />
          <Header />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
