import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Compass, Plus, MessageSquare, User } from "lucide-react";

export default function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  const isHome = path === "/dashboard";
  const isTrips = path === "/trips" || path.startsWith("/trips/") && !path.endsWith("/create") && !path.includes("/edit") || path === "/trip-history";
  const isChat = path === "/chat" || path.includes("/discussion");
  const isProfile = path === "/profile" || path === "/settings";

  return (
    <nav className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-sm">
      <div className="flex items-center justify-between max-w-md mx-auto relative">
        {/* 1. Home */}
        <Link
          to="/dashboard"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isHome ? "text-blue-600 font-semibold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Home size={22} strokeWidth={isHome ? 2.4 : 1.8} />
          <span className="text-[11px] mt-1">Home</span>
        </Link>

        {/* 2. Trips */}
        <Link
          to="/trips"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isTrips ? "text-blue-600 font-semibold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Compass size={22} strokeWidth={isTrips ? 2.4 : 1.8} />
          <span className="text-[11px] mt-1">Trips</span>
        </Link>

        {/* 3. Center Floating (+) Action Button */}
        <div className="flex items-center justify-center flex-1 -mt-5">
          <Link
            to="/trips/create"
            className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 hover:bg-blue-700 active:scale-95 transition-transform"
            aria-label="Create Trip"
          >
            <Plus size={24} strokeWidth={2.8} />
          </Link>
        </div>

        {/* 4. Chat */}
        <Link
          to="/chat"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isChat ? "text-blue-600 font-semibold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <MessageSquare size={22} strokeWidth={isChat ? 2.4 : 1.8} />
          <span className="text-[11px] mt-1">Chat</span>
        </Link>

        {/* 5. Profile */}
        <Link
          to="/profile"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isProfile ? "text-blue-600 font-semibold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <User size={22} strokeWidth={isProfile ? 2.4 : 1.8} />
          <span className="text-[11px] mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
