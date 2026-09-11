import React from "react";
import BottomNav from "./BottomNav";

export default function MobileShell({
  children,
  showBottomNav = true,
  className = "",
  contentClassName = "",
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start">
      {/* Responsive Container: Fluid on mobile, comfortably spacious on desktop */}
      <div
        className={`w-full max-w-md md:max-w-3xl lg:max-w-4xl min-h-screen flex flex-col bg-white md:my-6 md:min-h-[90vh] md:rounded-3xl md:shadow-xl md:border md:border-slate-100 overflow-hidden relative transition-all ${className}`}
      >
        {/* Main Content Area */}
        <main
          className={`flex-1 overflow-y-auto flex flex-col min-h-0 ${contentClassName}`}
        >
          {children}
        </main>

        {/* Bottom Navigation */}
        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
}
