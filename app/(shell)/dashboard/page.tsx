import { DashboardStats } from "@/components/dashboard-stats";
import {
  computeDashboardAnalytics,
  currentDashboardFilters,
} from "@/lib/dashboard-analytics";
import { getStorageAdapter } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const storage = getStorageAdapter();
  const facturas = await storage.listFacturas();
  const initialAnalytics = computeDashboardAnalytics(facturas, currentDashboardFilters());

  return <DashboardStats initialAnalytics={initialAnalytics} />;
}
