"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeft,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/facturas", label: "Facturas", icon: FileText },
] as const;

const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_COLLAPSED = "4.5rem";

function isNavActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === "/facturas" || pathname.startsWith("/facturas/");
}

function SidebarBrand({ collapsed }: { collapsed: boolean }) {
  return (
    <Link
      href="/dashboard"
      className={cn(
        "group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-sidebar-accent",
        collapsed && "justify-center",
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-[#5B5AE8] to-[#6366F1] shadow-md shadow-primary/20">
        <span className="font-heading text-lg font-extrabold text-white">S</span>
      </div>
      {!collapsed ? (
        <div className="min-w-0">
          <p className="font-heading text-sm font-bold leading-tight text-sidebar-foreground">Surpass</p>
          <p className="text-xs text-muted-foreground">Facturas PDF</p>
        </div>
      ) : null}
    </Link>
  );
}

function SidebarNav({
  pathname,
  collapsed,
  onNavigate,
}: {
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1 px-2">
      {!collapsed ? (
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Menú
        </p>
      ) : null}
      {navItems.map((item) => {
        const active = isNavActive(pathname, item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            title={collapsed ? item.label : undefined}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
              collapsed && "justify-center px-2",
              active
                ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/15"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
            )}
          >
            <Icon className={cn("h-[1.125rem] w-[1.125rem] shrink-0", active && "text-primary")} />
            {!collapsed ? <span>{item.label}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}

function AppSidebar({
  pathname,
  collapsed,
  onNavigate,
  className,
}: {
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="border-b border-sidebar-border p-4">
        <SidebarBrand collapsed={collapsed} />
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <SidebarNav pathname={pathname} collapsed={collapsed} onNavigate={onNavigate} />
      </div>

      <div className="border-t border-sidebar-border p-3">
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "w-full text-muted-foreground hover:bg-sidebar-accent hover:text-destructive",
            collapsed ? "h-10 justify-center px-0" : "justify-start gap-3",
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed ? <span className="font-medium">Cerrar sesión</span> : null}
        </Button>
      </div>
    </div>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const mainPadding = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH;

  return (
    <div className="min-h-svh bg-background">
      <aside
        className="app-sidebar fixed inset-y-0 left-0 z-40 hidden lg:flex lg:flex-col"
        style={{ width: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH }}
      >
        <AppSidebar pathname={pathname} collapsed={collapsed} />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-[min(100vw-2rem,16rem)] gap-0 border-sidebar-border bg-sidebar p-0"
        >
          <SheetHeader className="flex flex-row items-center justify-between border-b border-sidebar-border px-4 py-3">
            <SheetTitle className="font-heading text-base">Menú</SheetTitle>
            <SheetClose
              render={
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" />
              }
            >
              <X className="h-4 w-4" />
            </SheetClose>
          </SheetHeader>
          <AppSidebar pathname={pathname} collapsed={false} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div
        className="flex min-h-svh min-w-0 flex-col transition-[padding] duration-300 lg:pl-[var(--sidebar-pad)]"
        style={{ "--sidebar-pad": mainPadding } as React.CSSProperties}
      >
        <header className="app-shell-header sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 px-4 sm:px-6">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hidden h-9 w-9 text-muted-foreground hover:bg-muted lg:inline-flex"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
          >
            <PanelLeft className="h-5 w-5" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:bg-muted lg:hidden"
            aria-label="Abrir menú"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Separator orientation="vertical" className="hidden h-5 lg:block" />

          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate text-sm text-muted-foreground">
              <span className="hidden sm:inline">Distribuidora </span>
              <span className="font-semibold text-foreground">Surpass</span>
            </span>
          </div>
        </header>

        <main className="app-mesh-bg flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
