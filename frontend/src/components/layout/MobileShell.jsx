import React from "react";
import BottomNav from "./BottomNav";

export default function MobileShell({
  children,
  showBottomNav = true,
  className = "",
  contentClassName = "",
}) {
  return (
    <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center bg-slate-100 overflow-hidden">
      {/* 
        App Viewport Container:
        - Mobile Phones: 100% full-width and full-height, pinned flush to the screen edges with zero top gap.
        - Tablets & iPads: Centered, clean canvas (max-w-2xl / max-w-3xl) with smooth rounded corners.
      */}
      <div
        className={`w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl h-full sm:h-[96vh] sm:max-h-[960px] flex flex-col bg-white sm:shadow-2xl sm:rounded-3xl overflow-hidden relative ${className}`}
      >
        {/* Scrollable Viewport (the only scrolling element) */}
        <main
          className={`flex-1 overflow-y-auto overscroll-contain flex flex-col min-h-0 ${contentClassName}`}
        >
          {children}
        </main>

        {/* Stable, Unscrollable Bottom Navigation */}
        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
}
