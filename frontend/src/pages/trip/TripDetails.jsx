import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MoreVertical,
  Calendar,
  Wallet,
  CheckSquare,
  Users,
  MapPin,
  CalendarDays,
  Pencil,
  Trash2,
  Share2,
} from "lucide-react";
import MobileShell from "../../components/layout/MobileShell";
import { getTrip, deleteTrip } from "../../api/authApi";

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTripData = async () => {
      const token = localStorage.getItem("campusTripToken");
      if (!token) {
        navigate("/login");
        return;
      }

      if (!id) {
        navigate("/trips");
        return;
      }

      try {
        setLoading(true);
        const data = await getTrip(id, token);
        if (data?.trip) {
          setTrip(data.trip);
        } else {
          setError("Trip not found.");
        }
      } catch (err) {
        setError(err.message || "Unable to load trip details.");
      } finally {
        setLoading(false);
      }
    };

    loadTripData();
  }, [id, navigate]);

  const handleDeleteTrip = async () => {
    if (!window.confirm(`Are you sure you want to delete "${trip?.title}"?`)) return;
    const token = localStorage.getItem("campusTripToken");
    if (token && id) {
      try {
        await deleteTrip(id, token);
        navigate("/trips");
      } catch (e) {
        alert(e.message || "Failed to delete trip.");
      }
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-TH", {
      style: "currency",
      currency: "THB",
      maximumFractionDigits: 0,
    }).format(val || 0);
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

  if (loading) {
    return (
      <MobileShell showBottomNav={true} contentClassName="bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </MobileShell>
    );
  }

  if (error || !trip) {
    return (
      <MobileShell showBottomNav={true} contentClassName="bg-white p-6 flex flex-col items-center justify-center text-center">
        <h2 className="text-sm font-bold text-slate-800">Trip Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">{error || "This trip does not exist or has been removed."}</p>
        <Link
          to="/trips"
          className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
        >
          Back to My Trips
        </Link>
      </MobileShell>
    );
  }

  return (
    <MobileShell showBottomNav={true} contentClassName="bg-white">
      {/* Top Banner & Header Overlay */}
      <div className="relative">
        {/* Hero Image */}
        <div className="h-56 w-full relative overflow-hidden bg-gradient-to-tr from-sky-400 via-blue-500 to-cyan-400">
          <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="skyGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="60%" stopColor="#7DD3FC" />
                <stop offset="100%" stopColor="#BAE6FD" />
              </linearGradient>
            </defs>
            <rect width="400" height="240" fill="url(#skyGrad2)" />
            <circle cx="320" cy="60" r="32" fill="#FEF08A" opacity="0.9" />
            <path d="M 0 160 Q 150 120 400 165 L 400 240 L 0 240 Z" fill="#F59E0B" opacity="0.3" />
            <path d="M 0 175 Q 200 155 400 178 L 400 240 L 0 240 Z" fill="#0284C7" />
            <path d="M 0 195 Q 180 185 400 200 L 400 240 L 0 240 Z" fill="#0369A1" />
            <path d="M 40 210 Q 50 140 35 100" stroke="#78350F" strokeWidth="6" fill="none" />
            <path d="M 35 100 Q 10 90 0 110" stroke="#16A34A" strokeWidth="4" fill="none" />
            <path d="M 35 100 Q 55 75 75 90" stroke="#16A34A" strokeWidth="4" fill="none" />
          </svg>

          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        </div>

        {/* Top Floating Buttons */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <button
            onClick={() => navigate("/trips")}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition"
              aria-label="Options"
            >
              <MoreVertical size={18} />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-30 animate-in fade-in zoom-in-95">
                <Link
                  to={`/trips/${trip._id}/edit`}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                >
                  <Pencil size={13} />
                  <span>Edit Trip</span>
                </Link>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    alert("Trip link copied to clipboard!");
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 text-left"
                >
                  <Share2 size={13} />
                  <span>Share</span>
                </button>
                <button
                  onClick={handleDeleteTrip}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 text-left"
                >
                  <Trash2 size={13} />
                  <span>Delete Trip</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hero Title and Info inside overlay bottom */}
        <div className="absolute bottom-3 left-6 right-6 text-white z-10">
          <h1 className="text-2xl font-bold tracking-tight drop-shadow-md">
            {trip.title}
          </h1>
          <div className="flex items-center justify-between mt-1 text-xs text-slate-100">
            <p className="flex items-center gap-1.5 drop-shadow">
              <MapPin size={12} className="text-white" />
              <span>{trip.destination}</span>
            </p>
          </div>
          <div className="flex items-center justify-between mt-1 text-xs text-slate-100">
            <p className="flex items-center gap-1.5 drop-shadow">
              <CalendarDays size={12} className="text-white" />
              <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
            </p>
            <span className="px-2.5 py-0.5 bg-blue-600/90 backdrop-blur rounded-full text-[10px] font-semibold text-white shadow">
              {trip.status || "Planning"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="px-4 sm:px-6 py-5 space-y-5 sm:space-y-6">
        {/* 4 Action Icons Row */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          <Link
            to="/schedule"
            className="flex flex-col items-center justify-center p-2 sm:p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-indigo-50/50 hover:border-indigo-100 active:scale-95 transition group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1 sm:mb-1.5 group-hover:scale-105 transition-transform">
              <Calendar size={18} strokeWidth={2.2} className="sm:w-5 sm:h-5" />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-700 truncate w-full text-center">Schedule</span>
          </Link>

          <Link
            to="/budget"
            className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-purple-50/50 hover:border-purple-100 active:scale-95 transition group"
          >
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Wallet size={19} strokeWidth={2.2} />
            </div>
            <span className="text-[11px] font-semibold text-slate-700">Budget</span>
          </Link>

          <Link
            to="/checklist"
            className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-teal-50/50 hover:border-teal-100 active:scale-95 transition group"
          >
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <CheckSquare size={19} strokeWidth={2.2} />
            </div>
            <span className="text-[11px] font-semibold text-slate-700">Checklist</span>
          </Link>

          <Link
            to="/members"
            className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-blue-50/50 hover:border-blue-100 active:scale-95 transition group"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Users size={19} strokeWidth={2.2} />
            </div>
            <span className="text-[11px] font-semibold text-slate-700">Members</span>
          </Link>
        </div>

        {/* Trip Information Section */}
        <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">Trip Information</h2>
            <Link
              to={`/trips/${trip._id}/edit`}
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <Pencil size={12} />
              <span>Edit</span>
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500">Destination</span>
              <span className="font-semibold text-slate-800">
                {trip.destination}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500">District (Amphoe)</span>
              <span className="font-semibold text-slate-800">
                {trip.district || "—"}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500">Tambon (Subdistrict)</span>
              <span className="font-semibold text-slate-800">
                {trip.tambon || "—"}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500">Transportation</span>
              <span className="font-semibold text-slate-800">
                {trip.transportation || "Bus"}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500">Trip Budget</span>
              <span className="font-semibold text-slate-800">
                {formatCurrency(trip.budget)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
