import React from "react";

export function OnboardingHikerIllustration({ className = "w-48 h-48" }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#BAE6FD" />
            <stop offset="100%" stopColor="#E0F2FE" />
          </linearGradient>
          <linearGradient id="mountainBack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="100%" stopColor="#BFDBFE" />
          </linearGradient>
          <linearGradient id="mountainFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="hill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>

        {/* Circular frame background */}
        <circle cx="120" cy="120" r="100" fill="url(#skyGrad)" />

        {/* Clouds */}
        <ellipse cx="65" cy="70" rx="20" ry="10" fill="#FFFFFF" opacity="0.8" />
        <ellipse cx="80" cy="65" rx="14" ry="9" fill="#FFFFFF" opacity="0.8" />
        <ellipse cx="170" cy="85" rx="22" ry="11" fill="#FFFFFF" opacity="0.75" />

        {/* Distant Mountains */}
        <polygon points="40,170 95,100 150,170" fill="url(#mountainBack)" />
        <polygon points="110,180 160,115 210,180" fill="url(#mountainBack)" />

        {/* Foreground Mountain */}
        <polygon points="65,185 125,110 185,185" fill="url(#mountainFront)" />
        <polygon points="115,110 125,110 135,125 125,120 118,126" fill="#EFF6FF" />

        {/* Green Hills Base */}
        <path d="M 20 170 Q 70 145 120 165 T 220 160 L 220 220 L 20 220 Z" fill="url(#hill)" />

        {/* Traveler Figure */}
        {/* Legs */}
        <rect x="112" y="160" width="6" height="22" rx="3" fill="#1E293B" />
        <rect x="122" y="160" width="6" height="22" rx="3" fill="#1E293B" />
        {/* Boots */}
        <rect x="110" y="180" width="9" height="5" rx="2" fill="#92400E" />
        <rect x="122" y="180" width="9" height="5" rx="2" fill="#92400E" />
        {/* Backpack (Orange/Yellow) */}
        <rect x="105" y="132" width="13" height="22" rx="4" fill="#F97316" />
        <rect x="104" y="136" width="4" height="14" rx="2" fill="#EA580C" />
        {/* Body (Blue jacket) */}
        <rect x="113" y="130" width="15" height="25" rx="5" fill="#2563EB" />
        {/* Arm pointing forward */}
        <path d="M 125 135 L 140 125" stroke="#2563EB" strokeWidth="5" strokeLinecap="round" />
        <circle cx="141" cy="124" r="3" fill="#FBBF24" />
        {/* Walking stick */}
        <line x1="140" y1="126" x2="146" y2="185" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
        {/* Head & Hat */}
        <circle cx="120" cy="120" r="7" fill="#FBBF24" />
        <ellipse cx="120" cy="115" rx="9" ry="3.5" fill="#374151" />
        <path d="M 114 114 Q 120 108 126 114 Z" fill="#374151" />
      </svg>
    </div>
  );
}

export function HighFiveIllustration({ className = "w-48 h-40" }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 240 180" className="w-full h-full drop-shadow-sm">
        <defs>
          <linearGradient id="personLeft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="personRight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>

        {/* Soft background aura */}
        <circle cx="120" cy="90" r="70" fill="#EFF6FF" />

        {/* Person Left (Blue outfit) */}
        {/* Head */}
        <circle cx="85" cy="55" r="14" fill="#FBBF24" />
        <path d="M 75 52 Q 85 40 95 50 Q 85 45 75 52 Z" fill="#1E293B" />
        {/* Body */}
        <path d="M 70 80 Q 85 75 100 80 L 96 140 L 74 140 Z" fill="url(#personLeft)" />
        {/* Arm raising up for high five */}
        <path d="M 92 82 Q 105 70 115 50" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round" fill="none" />
        <circle cx="116" cy="48" r="5" fill="#FBBF24" />

        {/* Spark of high five */}
        <polygon points="120,40 123,45 128,43 125,48 129,52 124,53 123,58 119,54 114,56 116,51 112,47 117,46" fill="#F59E0B" />

        {/* Person Right (Green outfit) */}
        {/* Head */}
        <circle cx="155" cy="55" r="14" fill="#FBBF24" />
        <path d="M 145 52 Q 155 42 165 52 Z" fill="#3B82F6" />
        {/* Body */}
        <path d="M 140 80 Q 155 75 170 80 L 166 140 L 144 140 Z" fill="url(#personRight)" />
        {/* Arm raising up for high five */}
        <path d="M 148 82 Q 135 70 125 50" stroke="#10B981" strokeWidth="8" strokeLinecap="round" fill="none" />
        <circle cx="124" cy="48" r="5" fill="#FBBF24" />
      </svg>
    </div>
  );
}

export function TripThumbnail({ destination = "Pattaya", className = "w-16 h-16 rounded-2xl" }) {
  const dest = destination.toLowerCase();

  if (dest.includes("pattaya") || dest.includes("chon buri") || dest.includes("beach")) {
    return (
      <div className={`overflow-hidden relative bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center shrink-0 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full object-cover">
          <rect width="100" height="100" fill="#38BDF8" />
          <circle cx="75" cy="30" r="14" fill="#FDE047" />
          <path d="M 0 65 Q 40 50 100 68 L 100 100 L 0 100 Z" fill="#F59E0B" opacity="0.4" />
          <path d="M 0 75 Q 50 65 100 75 L 100 100 L 0 100 Z" fill="#0284C7" />
          <path d="M 0 85 Q 50 78 100 85 L 100 100 L 0 100 Z" fill="#0369A1" />
          {/* Palm tree */}
          <path d="M 22 80 Q 25 55 20 40" stroke="#78350F" strokeWidth="3" fill="none" />
          <path d="M 20 40 Q 10 35 5 45" stroke="#15803D" strokeWidth="2.5" fill="none" />
          <path d="M 20 40 Q 25 30 35 35" stroke="#15803D" strokeWidth="2.5" fill="none" />
          <path d="M 20 40 Q 15 28 8 30" stroke="#15803D" strokeWidth="2.5" fill="none" />
        </svg>
      </div>
    );
  }

  if (dest.includes("bangsaen")) {
    return (
      <div className={`overflow-hidden relative bg-gradient-to-tr from-teal-400 to-emerald-600 flex items-center justify-center shrink-0 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full object-cover">
          <rect width="100" height="100" fill="#2DD4BF" />
          <circle cx="30" cy="30" r="12" fill="#FEF08A" />
          <path d="M 0 70 Q 50 60 100 70 L 100 100 L 0 100 Z" fill="#0D9488" />
          <path d="M 70 85 Q 75 60 70 45" stroke="#78350F" strokeWidth="3" fill="none" />
          <path d="M 70 45 Q 60 40 55 50" stroke="#15803D" strokeWidth="2.5" fill="none" />
          <path d="M 70 45 Q 80 35 90 42" stroke="#15803D" strokeWidth="2.5" fill="none" />
        </svg>
      </div>
    );
  }

  if (dest.includes("chiang mai")) {
    return (
      <div className={`overflow-hidden relative bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shrink-0 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full object-cover">
          <rect width="100" height="100" fill="#F59E0B" />
          <polygon points="50,15 35,45 65,45" fill="#FEF08A" />
          <polygon points="50,25 30,60 70,60" fill="#FBBF24" />
          <rect x="38" y="60" width="24" height="28" fill="#B45309" />
          <rect x="44" y="70" width="12" height="18" rx="6" fill="#451A03" />
        </svg>
      </div>
    );
  }

  // Default Ayutthaya or heritage
  return (
    <div className={`overflow-hidden relative bg-gradient-to-tr from-amber-600 to-yellow-700 flex items-center justify-center shrink-0 ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full object-cover">
        <rect width="100" height="100" fill="#D97706" />
        <polygon points="50,20 40,55 60,55" fill="#FDE68A" />
        <polygon points="50,30 32,70 68,70" fill="#F59E0B" />
        <rect x="35" y="70" width="30" height="25" fill="#78350F" />
      </svg>
    </div>
  );
}
