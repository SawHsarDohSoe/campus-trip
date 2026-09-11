import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Plus, MapPin, CalendarDays, ChevronRight } from "lucide-react";
import MobileShell from "../../components/layout/MobileShell";
import { TripThumbnail } from "../../components/common/Illustrations";
import { getTrips } from "../../api/authApi";

export default function MyTrips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserTrips = async () => {
      const token = localStorage.getItem("campusTripToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const data = await getTrips(token);
        if (data?.trips) {
          setTrips(data.trips);
        }
      } catch (err) {
        console.error("Failed to load trips:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserTrips();
  }, [navigate]);

  const filteredTrips = useMemo(() => {
    if (activeFilter === "All") return trips;
    return trips.filter((t) => t.status === activeFilter);
  }, [trips, activeFilter]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Planning":
        return "bg-blue-50 text-blue-600 border border-blue-100";
      case "Ongoing":
      case "Upcoming":
        return "bg-emerald-50 text-emerald-600 border border-emerald-100";
      case "Completed":
      default:
        return "bg-slate-100 text-slate-500 border border-slate-200";
    }
  };

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
      {/* Top Header */}
      <div className="bg-white px-5 pt-4 pb-3 flex items-center justify-between border-b border-slate-100 sticky top-0 z-20">
        <h1 className="text-xl font-bold text-slate-900">My Trips</h1>

        <div className="flex items-center gap-2.5">
          <Link
            to="/notifications"
            className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition"
            aria-label="Notifications"
          >
            <Bell size={17} />
          </Link>

          <Link
            to="/trips/create"
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full shadow-sm shadow-blue-500/30 transition active:scale-95"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>New Trip</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-5 pt-4 pb-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {["All", "Planning", "Ongoing", "Completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              activeFilter === tab
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Trips List */}
      <div className="px-5 py-3 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3">
              <MapPin size={22} />
            </div>
            <p className="text-xs font-bold text-slate-800">No trips found</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
              You don't have any trips matching this filter.
            </p>
            <Link
              to="/trips/create"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-md"
            >
              <Plus size={13} strokeWidth={2.5} />
              <span>Create New Trip</span>
            </Link>
          </div>
        ) : (
          filteredTrips.map((trip) => (
            <Link
              key={trip._id}
              to={`/trips/${trip._id}`}
              className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md hover:border-slate-200 transition group"
            >
              {/* Thumbnail */}
              <TripThumbnail
                destination={trip.destination || trip.title}
                className="w-20 h-20 rounded-xl"
              />

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition">
                  {trip.title}
                </h2>

                <p className="flex items-center gap-1 text-[11px] text-slate-500 mt-1 truncate">
                  <MapPin size={12} className="text-slate-400 shrink-0" />
                  <span>{trip.destination}</span>
                </p>

                <p className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 truncate">
                  <CalendarDays size={12} className="text-slate-400 shrink-0" />
                  <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                </p>

                <div className="mt-2">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${getStatusBadge(
                      trip.status
                    )}`}
                  >
                    {trip.status}
                  </span>
                </div>
              </div>

              <ChevronRight size={17} className="text-slate-300 group-hover:text-blue-600 transition shrink-0" />
            </Link>
          ))
        )}
      </div>
    </MobileShell>
  );
}
