import React from "react";
import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";

export default function MobileShell({
  children,
  showBottomNav = true,
  className = "",
  contentClassName = "",
}) {
  return (
    <div className="fixed inset-0 w-full h-full flex flex-col md:flex-row bg-white md:bg-slate-100 overflow-hidden">
      {/* Desktop Sidebar (visible on md+ screens) */}
      <div className="hidden md:flex shrink-0 h-full">
        <Sidebar />
      </div>

      {/* Main App Container */}
      <div className="flex-1 h-full flex flex-col min-w-0 bg-white md:bg-slate-50 relative overflow-hidden">
        {/* Scrollable Viewport */}
        <main
          className={`flex-1 overflow-y-auto overscroll-contain flex flex-col min-h-0 ${contentClassName}`}
        >
          <div className={`w-full max-w-full md:max-w-5xl mx-auto flex-1 flex flex-col ${className}`}>
            {children}
          </div>
        </main>

        {/* Stable, Unscrollable Bottom Navigation for Mobile (hidden on md+) */}
        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
}

