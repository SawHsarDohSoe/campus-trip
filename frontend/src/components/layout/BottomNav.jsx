import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Compass, KeyRound, Plus, MessageSquare, User, X } from "lucide-react";

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [showTripActions, setShowTripActions] = useState(false);

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
    setShowTripActions(false);
    // Regular push navigation so Back returns to previous screen
    navigate("/trips/create", { state: { from: path } });
  };

  const handleJoinClick = () => {
    setShowTripActions(false);
    navigate("/join-trip", { state: { from: path } });
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

        {/* 3. Center elevated trip actions */}
        <div className="flex items-center justify-center flex-1 -mt-6">
          {showTripActions && (
            <div className="absolute bottom-[4.75rem] left-1/2 -translate-x-1/2 w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/15">
              <button
                type="button"
                onClick={handleCreateClick}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
              >
                <Plus size={18} strokeWidth={2.5} />
                Create Trip
              </button>
              <button
                type="button"
                onClick={handleJoinClick}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
              >
                <KeyRound size={18} strokeWidth={2.2} />
                Join Trip
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowTripActions((isOpen) => !isOpen)}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-blue-700 to-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-600/35 hover:brightness-110 active:scale-95 transition-all cursor-pointer ring-4 ring-white"
            aria-label={showTripActions ? "Close trip actions" : "Trip actions"}
            aria-expanded={showTripActions}
          >
            {showTripActions ? <X size={24} strokeWidth={3} /> : <Plus size={26} strokeWidth={3} />}
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
