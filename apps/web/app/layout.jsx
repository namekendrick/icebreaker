import { Nunito } from "next/font/google";

import { Toaster } from "@workspace/ui/components/sonner";
import { Providers } from "@/providers";

import "@workspace/ui/globals.css";

const nunito = Nunito({
  subsets: ["latin"],
});

export const metadata = {
  title: "Icebreaker | New Question Every Day",
  description: "Break the ice with a new question every day",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.className} antialiased`}>
        <Providers>{children}</Providers>
        <Toaster richColors />
      </body>
    </html>
  );
}
