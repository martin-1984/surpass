import { DashboardShell } from "@/components/app-sidebar";

export default function ReportesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
