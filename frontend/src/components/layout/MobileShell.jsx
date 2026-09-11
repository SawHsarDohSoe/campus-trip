import React from "react";
import BottomNav from "./BottomNav";

export default function MobileShell({
  children,
  showBottomNav = true,
  className = "",
  contentClassName = "",
}) {
  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col items-center justify-start w-full">
      {/* 
        Responsive Shell for Mobile Phones, Tablets, and iPads:
        - Mobile Phones (< 640px): 100% full-width, edge-to-edge native app feel.
        - Tablets & iPads (640px - 1024px+): Clean centered tablet canvas (max-w-2xl / max-w-3xl) with smooth corners.
      */}
      <div
        className={`w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl min-h-screen flex flex-col bg-white sm:shadow-lg sm:my-3 sm:rounded-3xl overflow-hidden relative transition-all ${className}`}
      >
        {/* Main Content Viewport */}
        <main
          className={`flex-1 overflow-y-auto flex flex-col min-h-0 ${contentClassName}`}
        >
          {children}
        </main>

        {/* Persistent Bottom Navigation for Mobile & Tablet/iPad App */}
        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
}
