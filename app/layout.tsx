import type { Metadata } from "next";
import "./globals.css";
import RootLayoutClient from "./RootLayoutClient";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "End of Night Company - Real Estate Brokerage",
  description: "Your trusted partner in real estate brokerage and consultancy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <RootLayoutClient>{children}</RootLayoutClient>
        </Providers>
      </body>
    </html>
  );
}
