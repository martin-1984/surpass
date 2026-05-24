import { PageTransition } from "@/components/page-transition";

export default function ShellTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageTransition>{children}</PageTransition>;
}
