import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/landing/Navbar";
import WaitlistModal from "@/components/landing/WaitlistModal";
import { TestProvider } from "@/context/TestContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DriveSync — Pass Your Learner's Test First Try",
  description: "SA learner's licence mock tests, road signs glossary, and smart driving school booking. Code 8, 10 & 14.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-slate-900 min-h-screen flex flex-col`}>
        <TestProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <WaitlistModal />
        </TestProvider>
      </body>
    </html>
  );
}
