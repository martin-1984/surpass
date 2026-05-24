import { DashboardShell } from "@/components/app-sidebar";

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
