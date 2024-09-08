import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/Header";
import { SideMenu } from "@/components/layout/SideMenu";
import { LoggedMenu } from "./inicio/page";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "CLT",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased min-w-full bg-gray-100 dark:bg-gray-950 overflow-hidden",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
        >
          <div className="flex flex-col min-h-screen dark:bg-gray-900">
            <Header />
            <div className="flex flex-col h-[calc(100vh-3.5rem)] ">
              {/* <SideMenu /> */}
              <LoggedMenu/>
              <main className="flex-1 mx-auto p-4 overflow-y-auto w-full">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}