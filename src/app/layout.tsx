import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { SachetTicker } from "@/components/UI/SachetTicker";
import { StoreProvider } from "@/components/Providers/StoreProvider";
import { fetchInitialState } from "@/actions/fetchData";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "IDCS | Disaster Relief Coordination",
  description: "Prototype disaster relief coordination system",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // Fetch from MongoDB
  const initialState = await fetchInitialState();

  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${cormorant.variable} antialiased bg-navy text-neutral-100`}
      >
        <StoreProvider initialState={initialState.success ? initialState.data : null}>
          <SachetTicker />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
