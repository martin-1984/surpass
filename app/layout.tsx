import type { Metadata } from "next";
import { Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Surpass | Facturas PDF",
  description: "Gestión de facturas PDF para Distribuidora Surpass",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${plusJakartaSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full font-sans">
        <TooltipProvider>
          {children}
          <Toaster
            richColors
            position="top-center"
            toastOptions={{
              className: "border border-border bg-background shadow-lg",
            }}
          />
        </TooltipProvider>
      </body>
    </html>
  );
}
