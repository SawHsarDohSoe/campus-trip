import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Wallet,
  CheckSquare,
  Users,
  MapPin,
  CalendarDays,
  ArrowRight,
  Plus,
  ChevronRight,
} from "lucide-react";
import MobileShell from "../../components/layout/MobileShell";
import MobileHeader from "../../components/layout/MobileHeader";
import WeatherCard from "../../components/weather/WeatherCard";
import { TripThumbnail } from "../../components/common/Illustrations";
import { getCurrentUser, getTrips, getNotifications, getWeather } from "../../api/authApi";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [upcomingTrip, setUpcomingTrip] = useState(null);
  const [recentTrips, setRecentTrips] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");

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
                (t) => t.status === "Planning" || t.status === "Ongoing" || t.status === "Upcoming"
              ) || sorted[0];
            setUpcomingTrip(active);
            setRecentTrips(sorted.filter((t) => t._id !== active._id).slice(0, 3));
          } else {
            setUpcomingTrip(null);
            setRecentTrips([]);
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

  useEffect(() => {
    if (!upcomingTrip?.destination) {
      setWeather(null);
      setWeatherError("");
      return;
    }

    let cancelled = false;
    const loadWeather = async () => {
      const token = localStorage.getItem("campusTripToken");
      if (!token) return;
      try {
        setWeatherLoading(true);
        setWeatherError("");
        const data = await getWeather(upcomingTrip.destination, token);
        if (!cancelled) setWeather(data);
      } catch (err) {
        if (!cancelled) {
          setWeather(null);
          setWeatherError(err.message || "Weather is temporarily unavailable.");
        }
      } finally {
        if (!cancelled) setWeatherLoading(false);
      }
    };

    loadWeather();
    return () => {
      cancelled = true;
    };
  }, [upcomingTrip?._id, upcomingTrip?.destination]);

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

  const getDistrictTambonText = (trip) => {
    if (!trip) return "";
    const parts = [];
    if (trip.tambon) parts.push(trip.tambon);
    if (trip.district) parts.push(trip.district);
    return parts.join(", ");
  };

  return (
    <MobileShell showBottomNav={true} contentClassName="bg-slate-50/60 pb-20">
      {/* Top Bar: CampusTrip Logo + Notification Bell */}
      <MobileHeader showBack={false} unreadCount={unreadCount} />

      <div className="px-4 sm:px-6 py-4 space-y-5">
        {/* Welcome Greeting */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Good to see you, {user?.name || "Francis"}! 👋
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Plan your next adventure.</p>
        </div>

        {/* Upcoming Trip Card */}
        {loading ? (
          <div className="h-44 rounded-3xl bg-slate-200/70 animate-pulse flex items-center justify-center">
            <span className="text-xs text-slate-400">Loading trips...</span>
          </div>
        ) : upcomingTrip ? (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 p-5 sm:p-6 text-white shadow-xl shadow-blue-500/20">
            {/* Background graphic */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none">
              <svg viewBox="0 0 160 200" className="w-full h-full object-cover">
                <circle cx="120" cy="40" r="50" fill="#FFFFFF" />
                <path d="M 40 180 Q 90 140 160 170 L 160 200 L 40 200 Z" fill="#FFFFFF" />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col justify-between min-h-[160px]">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-semibold text-white tracking-wide">
                    {upcomingTrip.status || "Upcoming Trip"}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm truncate">
                  {upcomingTrip.title}
                </h2>

                <div className="mt-2.5 space-y-1 text-xs text-blue-50 font-medium">
                  <p className="flex items-center gap-1.5 truncate">
                    <MapPin size={13} className="text-blue-100 shrink-0" />
                    <span>
                      {upcomingTrip.destination}
                      {getDistrictTambonText(upcomingTrip) && (
                        <span className="text-blue-200 text-[11px] ml-1">
                          ({getDistrictTambonText(upcomingTrip)})
                        </span>
                      )}
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CalendarDays size={13} className="text-blue-100 shrink-0" />
                    <span>
                      {formatDateRange(upcomingTrip.startDate, upcomingTrip.endDate)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-1">
                <Link
                  to={`/trips/${upcomingTrip._id}`}
                  state={{ from: "/dashboard" }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-blue-600 text-xs font-bold rounded-xl shadow-md hover:bg-blue-50 active:scale-95 transition"
                >
                  <span>View Details</span>
                  <ArrowRight size={13} strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-white border border-blue-100 p-6 text-center space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
              <Plus size={22} strokeWidth={2.5} />
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
                state={{ from: "/dashboard" }}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-sm hover:bg-blue-700 transition"
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

        {upcomingTrip && (
          <WeatherCard
            data={weather}
            error={weatherError}
            loading={weatherLoading}
            title={`Weather in ${upcomingTrip.destination}`}
            compact
          />
        )}

        {/* 4 Quick Action Buttons Grid */}
        <div>
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {/* Schedule */}
            <Link
              to="/schedule"
              state={{ from: "/dashboard", tripId: upcomingTrip?._id }}
              className="flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:border-indigo-100 active:scale-95 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <Calendar size={18} strokeWidth={2.2} />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 truncate w-full text-center">
                Schedule
              </span>
            </Link>

            {/* Budget */}
            <Link
              to="/budget"
              state={{ from: "/dashboard", tripId: upcomingTrip?._id }}
              className="flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:border-purple-100 active:scale-95 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <Wallet size={18} strokeWidth={2.2} />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 truncate w-full text-center">
                Budget
              </span>
            </Link>

            {/* Checklist */}
            <Link
              to="/checklist"
              state={{ from: "/dashboard", tripId: upcomingTrip?._id }}
              className="flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:border-teal-100 active:scale-95 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <CheckSquare size={18} strokeWidth={2.2} />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 truncate w-full text-center">
                Checklist
              </span>
            </Link>

            {/* Members */}
            <Link
              to="/members"
              state={{ from: "/dashboard", tripId: upcomingTrip?._id }}
              className="flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:border-blue-100 active:scale-95 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <Users size={18} strokeWidth={2.2} />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 truncate w-full text-center">
                Members
              </span>
            </Link>
          </div>
        </div>

        {/* Recent Trips / Useful Trip Information */}
        {recentTrips.length > 0 && (
          <div className="pt-1">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">Recent Trips</h2>
              <Link
                to="/trips"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                View all
              </Link>
            </div>

            <div className="space-y-2.5">
              {recentTrips.map((trip) => (
                <Link
                  key={trip._id}
                  to={`/trips/${trip._id}`}
                  state={{ from: "/dashboard" }}
                  className="p-3 bg-white rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3 hover:shadow-sm transition group"
                >
                  <TripThumbnail
                    destination={trip.destination || trip.title}
                    className="w-14 h-14 rounded-xl"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition">
                      {trip.title}
                    </h3>
                    <p className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 truncate">
                      <MapPin size={11} className="text-slate-400 shrink-0" />
                      <span>{trip.destination}</span>
                      {getDistrictTambonText(trip) && (
                        <span className="text-slate-400">· {getDistrictTambonText(trip)}</span>
                      )}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {formatDateRange(trip.startDate, trip.endDate)}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600 shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
