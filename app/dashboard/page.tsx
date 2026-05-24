import { DashboardStats } from "@/components/dashboard-stats";
import { getStorageAdapter } from "@/lib/storage";

export default async function DashboardPage() {
  const storage = getStorageAdapter();
  const stats = await storage.getDashboardStats();

  return (
    <DashboardStats
      totalFacturas={stats.totalFacturas}
      totalMonto={stats.totalMonto}
      facturasRecientes={stats.facturasRecientes}
    />
  );
}
