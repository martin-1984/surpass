"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const main = contentRef.current?.closest("main");
    if (main) main.scrollTop = 0;
  }, [pathname]);

  return (
    <div ref={contentRef} key={pathname} className="page-transition">
      {children}
    </div>
  );
}
