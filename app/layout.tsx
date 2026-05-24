import type { Metadata } from "next";
import { Geist_Mono, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
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
      className={`dark ${jakarta.variable} ${outfit.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full font-sans">
        <TooltipProvider>
          {children}
          <Toaster
            richColors
            position="top-center"
            toastOptions={{
              className: "backdrop-blur-xl border border-white/10",
            }}
          />
        </TooltipProvider>
      </body>
    </html>
  );
}
