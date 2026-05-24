"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/facturas", label: "Facturas", icon: FileText },
];

function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  }

  return (
    <Sidebar className="border-r border-white/10 bg-sidebar/80 backdrop-blur-xl">
      <SidebarHeader className="border-b border-white/10 p-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-xl p-1 transition-opacity hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-md shadow-cyan-500/20">
            <span className="font-heading text-lg font-bold text-white">S</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-base font-bold tracking-tight">
              Surpass
            </span>
            <span className="text-[10px] text-muted-foreground">
              Facturas PDF
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Menú
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname === "/facturas" ||
                      pathname.startsWith("/facturas/");

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      className={cn(
                        "h-10 rounded-xl transition-all",
                        isActive &&
                          "bg-gradient-to-r from-cyan-500/20 to-violet-500/10 text-cyan-300 shadow-sm ring-1 ring-cyan-500/20",
                      )}
                      render={
                        <Link href={item.href}>
                          <item.icon
                            className={cn(
                              "h-4 w-4",
                              isActive ? "text-cyan-400" : "",
                            )}
                          />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/10 p-4">
        <Button
          variant="outline"
          className="w-full justify-start border-white/10 bg-transparent hover:bg-white/5"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="app-mesh-bg flex min-h-svh min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-white/10 bg-background/60 px-4 backdrop-blur-xl sm:px-6">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          <Separator orientation="vertical" className="hidden h-6 sm:block" />
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Sparkles className="hidden h-4 w-4 shrink-0 text-cyan-400 sm:block" />
            <span className="truncate text-sm text-muted-foreground">
              <span className="hidden sm:inline">Distribuidora </span>
              <span className="font-medium text-foreground">Surpass</span>
            </span>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </div>
      </main>
    </SidebarProvider>
  );
}
