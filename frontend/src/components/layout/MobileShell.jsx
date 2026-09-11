import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Compass,
  Plus,
  MessageSquare,
  User,
  Bell,
  LogOut,
  Calendar,
  Wallet,
  CheckSquare,
  Users,
  KeyRound,
} from "lucide-react";
import BottomNav from "./BottomNav";

export default function MobileShell({
  children,
  showBottomNav = true,
  className = "",
  contentClassName = "",
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("campusTripCurrentUser");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("campusTripToken");
    localStorage.removeItem("campusTripCurrentUser");
    navigate("/login");
  };

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Trips", href: "/trips", icon: Compass },
    { name: "Schedule", href: "/schedule", icon: Calendar },
    { name: "Budget", href: "/budget", icon: Wallet },
    { name: "Checklist", href: "/checklist", icon: CheckSquare },
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Members", href: "/members", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ================= DESKTOP TOP NAVIGATION HEADER (Visible on md and up) ================= */}
      <header className="hidden md:block sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-[#1E3A8A] flex items-center justify-center text-white shadow-md transition group-hover:scale-105">
              <span className="text-xl">🧳</span>
            </div>
            <div>
              <span className="font-extrabold text-lg text-[#1E3A8A] tracking-tight">
                CampusTrip
              </span>
              <span className="block text-[10px] text-blue-600 font-medium -mt-1">
                Plan smarter. Travel together.
              </span>
            </div>
          </Link>

          {/* Center Nav Links */}
          <nav className="flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive =
                path === item.href ||
                (item.href !== "/dashboard" && path.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={15} strokeWidth={isActive ? 2.4 : 1.8} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/join-trip"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 text-blue-700 bg-blue-50/60 hover:bg-blue-100/80 text-xs font-semibold transition"
              title="Join a trip using a 6-digit code"
            >
              <KeyRound size={14} />
              <span>Join Code</span>
            </Link>

            <Link
              to="/trips/create"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition"
            >
              <Plus size={15} strokeWidth={2.6} />
              <span>New Trip</span>
            </Link>

            <div className="h-5 w-px bg-slate-200 mx-1"></div>

            <Link
              to="/notifications"
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              title="Notifications"
            >
              <Bell size={18} />
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition"
              title="User Profile"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                {(user?.name || "U")[0].toUpperCase()}
              </div>
              <span className="text-xs font-semibold max-w-[100px] truncate">
                {user?.name || "Profile"}
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
              title="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* ================= RESPONSIVE CONTENT AREA ================= */}
      {/* Mobile: fluid full-width column */}
      {/* Desktop: clean max-w-7xl centered responsive layout */}
      <div className="flex-1 flex flex-col w-full">
        <div
          className={`w-full md:max-w-7xl md:mx-auto flex-1 flex flex-col bg-white md:bg-transparent ${className}`}
        >
          <main className={`flex-1 flex flex-col min-h-0 ${contentClassName}`}>
            {children}
          </main>
        </div>
      </div>

      {/* ================= MOBILE BOTTOM NAVIGATION (Hidden on desktop md and up) ================= */}
      {showBottomNav && (
        <div className="block md:hidden">
          <BottomNav />
        </div>
      )}
    </div>
  );
}
