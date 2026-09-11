import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Calendar,
  Wallet,
  CheckSquare,
  Users,
  MapPin,
  CalendarDays,
  ArrowRight,
  Plus,
} from "lucide-react";
import MobileShell from "../../components/layout/MobileShell";
import BrandLogo from "../../components/common/BrandLogo";
import { getCurrentUser, getTrips, getNotifications } from "../../api/authApi";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [upcomingTrip, setUpcomingTrip] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      const token = localStorage.getItem("campusTripToken");
      const storedUser = localStorage.getItem("campusTripCurrentUser");

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          // ignore
        }
      }

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        // Current user
        try {
          const userData = await getCurrentUser(token);
          if (userData?.user) {
            setUser(userData.user);
            localStorage.setItem("campusTripCurrentUser", JSON.stringify(userData.user));
          }
        } catch {
          // fallback to stored user
        }

        // Real Trips
        try {
          const tripsData = await getTrips(token);
          if (tripsData?.trips?.length) {
            const sorted = [...tripsData.trips].sort(
              (a, b) => new Date(a.startDate) - new Date(b.startDate)
            );
            const active =
              sorted.find(
                (t) => t.status === "Planning" || t.status === "Upcoming"
              ) || sorted[0];
            setUpcomingTrip(active);
          } else {
            setUpcomingTrip(null);
          }
        } catch (err) {
          console.error("Error loading trips:", err);
        }

        // Real Notifications
        try {
          const notifData = await getNotifications(token);
          if (notifData?.notifications) {
            const unread = notifData.notifications.filter((n) => !n.read).length;
            setUnreadCount(unread);
          }
        } catch {
          // ignore
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [navigate]);

  const formatDateRange = (start, end) => {
    if (!start) return "Date flexible";
    const s = new Date(start).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
    const e = end
      ? new Date(end).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "";
    return e ? `${s} - ${e}` : s;
  };

  return (
    <MobileShell showBottomNav={true} contentClassName="bg-slate-50/50">
      {/* Top Bar: Logo + Notification Bell */}
      <div className="bg-white px-6 pt-4 pb-3 flex items-center justify-between border-b border-slate-100">
        <BrandLogo size="sm" />
        <Link
          to="/notifications"
          className="relative w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
          )}
        </Link>
      </div>

      <div className="px-6 py-5 space-y-6">
        {/* Welcome Greeting */}
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Good to see you, {user?.name || "Francis"}! 👋
          </h1>
          <p className="text-xs text-slate-500 mt-1">Plan your next adventure</p>
        </div>

        {/* Upcoming Trip Card */}
        {loading ? (
          <div className="h-44 rounded-3xl bg-slate-200/70 animate-pulse flex items-center justify-center">
            <span className="text-xs text-slate-400">Loading trips...</span>
          </div>
        ) : upcomingTrip ? (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-sky-400 to-sky-300 p-6 text-white shadow-xl shadow-blue-500/20">
            {/* Background graphic */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none">
              <svg viewBox="0 0 160 200" className="w-full h-full object-cover">
                <circle cx="120" cy="40" r="50" fill="#FFFFFF" />
                <path d="M 40 180 Q 90 140 160 170 L 160 200 L 40 200 Z" fill="#FFFFFF" />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col justify-between min-h-[165px]">
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-semibold text-white tracking-wide mb-3">
                  Upcoming Trip
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                  {upcomingTrip.title}
                </h2>

                <div className="mt-3 space-y-1 text-xs text-blue-50 font-medium">
                  <p className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-blue-100 shrink-0" />
                    <span>{upcomingTrip.destination}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CalendarDays size={13} className="text-blue-100 shrink-0" />
                    <span>
                      {formatDateRange(upcomingTrip.startDate, upcomingTrip.endDate)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-2">
                <Link
                  to={`/trips/${upcomingTrip._id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-blue-600 text-xs font-bold rounded-xl shadow-md hover:bg-blue-50 active:scale-95 transition"
                >
                  <span>See Details</span>
                  <ArrowRight size={13} strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-blue-50/70 border border-blue-100 p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/30">
              <Plus size={22} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">No Upcoming Trips</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Start planning your first group campus trip or join your friends.
              </p>
            </div>
            <div className="pt-1 flex items-center justify-center gap-2">
              <Link
                to="/trips/create"
                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-md hover:bg-blue-700 transition"
              >
                Create Trip
              </Link>
              <Link
                to="/join-trip"
                className="px-4 py-2 bg-white text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
              >
                Join with Code
              </Link>
            </div>
          </div>
        )}

        {/* 4 Quick Action Buttons Grid */}
        <div>
          <div className="grid grid-cols-4 gap-3">
            {/* Schedule */}
            <Link
              to="/schedule"
              className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 active:scale-95 transition group"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Calendar size={20} strokeWidth={2.2} />
              </div>
              <span className="text-[11px] font-semibold text-slate-700">Schedule</span>
            </Link>

            {/* Budget */}
            <Link
              to="/budget"
              className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-purple-100 active:scale-95 transition group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Wallet size={20} strokeWidth={2.2} />
              </div>
              <span className="text-[11px] font-semibold text-slate-700">Budget</span>
            </Link>

            {/* Checklist */}
            <Link
              to="/checklist"
              className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-100 active:scale-95 transition group"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <CheckSquare size={20} strokeWidth={2.2} />
              </div>
              <span className="text-[11px] font-semibold text-slate-700">Checklist</span>
            </Link>

            {/* Members */}
            <Link
              to="/members"
              className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 active:scale-95 transition group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Users size={20} strokeWidth={2.2} />
              </div>
              <span className="text-[11px] font-semibold text-slate-700">Members</span>
            </Link>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
