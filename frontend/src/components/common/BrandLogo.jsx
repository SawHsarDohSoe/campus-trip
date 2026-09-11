import React from "react";
import { Rocket } from "lucide-react";

export function RocketBadge({ size = "md", className = "" }) {
  const sizeMap = {
    sm: "w-8 h-8 rounded-xl",
    md: "w-11 h-11 rounded-2xl",
    lg: "w-16 h-16 rounded-3xl",
    xl: "w-20 h-20 rounded-[28px]",
  };

  const iconSizes = {
    sm: 16,
    md: 22,
    lg: 32,
    xl: 40,
  };

  return (
    <div
      className={`bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0 text-white ${
        sizeMap[size] || sizeMap.md
      } ${className}`}
    >
      <Rocket
        size={iconSizes[size] || 22}
        className="transform -rotate-45 fill-white/20 stroke-white"
        strokeWidth={2.5}
      />
    </div>
  );
}

export default function BrandLogo({ size = "md", showTagline = false, className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <RocketBadge size={size} />
      <div className="flex flex-col justify-center">
        <span className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
          Campus<span className="text-blue-600">Trip</span>
        </span>
        {showTagline && (
          <span className="text-xs text-slate-500 font-medium">
            Plan Smarter. Travel Together.
          </span>
        )}
      </div>
    </div>
  );
}
