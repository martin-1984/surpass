import { DashboardShell } from "@/components/app-sidebar";

export default function FacturasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
