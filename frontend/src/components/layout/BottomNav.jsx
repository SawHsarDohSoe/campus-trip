import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Compass, Plus, MessageSquare, User } from "lucide-react";

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const isHome = path === "/dashboard";
  const isTrips =
    path === "/trips" ||
    (path.startsWith("/trips/") && !path.endsWith("/create") && !path.includes("/edit")) ||
    path === "/trip-history";
  const isChat = path === "/chat" || path.includes("/discussion");
  const isProfile = path === "/profile" || path === "/settings";

  // Tab navigation with replace: true to prevent endless back-history loops
  const handleTabClick = (targetPath) => {
    if (path === targetPath) return;
    navigate(targetPath, { replace: true });
  };

  const handleCreateClick = () => {
    // Regular push navigation so Back returns to previous screen
    navigate("/trips/create", { state: { from: path } });
  };

  return (
    <nav className="w-full shrink-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-sm z-30 select-none md:hidden">
      <div className="w-full max-w-md sm:max-w-xl mx-auto px-3 pt-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] flex items-center justify-between relative">
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => handleTabClick("/dashboard")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            isHome ? "text-blue-600 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
          aria-label="Home"
        >
          <Home size={22} strokeWidth={isHome ? 2.5 : 1.8} />
          <span className="text-[11px] mt-1 font-medium tracking-tight">Home</span>
        </button>

        {/* 2. Trips */}
        <button
          type="button"
          onClick={() => handleTabClick("/trips")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            isTrips ? "text-blue-600 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
          aria-label="Trips"
        >
          <Compass size={22} strokeWidth={isTrips ? 2.5 : 1.8} />
          <span className="text-[11px] mt-1 font-medium tracking-tight">Trips</span>
        </button>

        {/* 3. Center Elevated (+) Create Trip Button */}
        <div className="flex items-center justify-center flex-1 -mt-6">
          <button
            type="button"
            onClick={handleCreateClick}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-blue-700 to-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-600/35 hover:brightness-110 active:scale-95 transition-all cursor-pointer ring-4 ring-white"
            aria-label="Create Trip"
          >
            <Plus size={26} strokeWidth={3} />
          </button>
        </div>

        {/* 4. Chat */}
        <button
          type="button"
          onClick={() => handleTabClick("/chat")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            isChat ? "text-blue-600 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
          aria-label="Chat"
        >
          <MessageSquare size={22} strokeWidth={isChat ? 2.5 : 1.8} />
          <span className="text-[11px] mt-1 font-medium tracking-tight">Chat</span>
        </button>

        {/* 5. Profile */}
        <button
          type="button"
          onClick={() => handleTabClick("/profile")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            isProfile ? "text-blue-600 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
          aria-label="Profile"
        >
          <User size={22} strokeWidth={isProfile ? 2.5 : 1.8} />
          <span className="text-[11px] mt-1 font-medium tracking-tight">Profile</span>
        </button>
      </div>
    </nav>
  );
}

