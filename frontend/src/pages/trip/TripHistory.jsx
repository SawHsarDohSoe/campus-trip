import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, CalendarDays, History } from "lucide-react";
import MobileShell from "../../components/layout/MobileShell";
import { TripThumbnail } from "../../components/common/Illustrations";
import { getTripHistory } from "../../api/authApi";

export default function TripHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      const token = localStorage.getItem("campusTripToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const data = await getTripHistory(token);
        if (data?.trips) {
          setHistory(data.trips);
        }
      } catch (err) {
        console.error("Error loading trip history:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
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
      {/* Top Header */}
      <div className="bg-white px-5 pt-3 pb-3 flex items-center gap-3 border-b border-slate-100 sticky top-0 z-20">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-700 transition"
          aria-label="Back"
        >
          <ArrowLeft size={19} />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Trip History</h1>
      </div>

      {/* History List */}
      <div className="px-5 py-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-20 px-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-2">
              <History size={24} />
            </div>
            <p className="text-xs font-bold text-slate-700">No Trip History</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
              Completed and past trips will appear here automatically.
            </p>
            <Link
              to="/trips"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
            >
              View Active Trips
            </Link>
          </div>
        ) : (
          history.map((trip) => (
            <Link
              key={trip._id}
              to={`/trips/${trip._id}`}
              className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md hover:border-slate-200 transition group"
            >
              {/* Thumbnail */}
              <TripThumbnail
                destination={trip.destination || trip.title}
                className="w-18 h-18 rounded-xl"
              />

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h2 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition">
                  {trip.title}
                </h2>

                <p className="flex items-center gap-1 text-[11px] text-slate-500 mt-1 truncate">
                  <CalendarDays size={12} className="text-slate-400 shrink-0" />
                  <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                </p>

                <div className="mt-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                    {trip.status || "Completed"}
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
