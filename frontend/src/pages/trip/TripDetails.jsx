import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
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
import MobileHeader from "../../components/layout/MobileHeader";
import WeatherCard from "../../components/weather/WeatherCard";
import { getWeatherLocation } from "../../utils/weatherLocation";
import { getTrip, deleteTrip, getWeather } from "../../api/authApi";

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [trip, setTrip] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const weatherLocation = getWeatherLocation(trip);
  const currentUserId = (() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("campusTripCurrentUser") || "null");
      return storedUser?.id || storedUser?._id || "";
    } catch {
      return "";
    }
  })();

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

  useEffect(() => {
    if (!weatherLocation) return;
    let cancelled = false;

    const loadWeather = async () => {
      const token = localStorage.getItem("campusTripToken");
      if (!token) return;
      try {
        setWeatherLoading(true);
        setWeatherError("");
        const tripDate = trip.startDate
          ? new Date(trip.startDate).toISOString().slice(0, 10)
          : undefined;
        const data = await getWeather(weatherLocation, token, tripDate);
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
  }, [trip?._id, trip?.startDate, weatherLocation]);

  const handleDeleteTrip = async () => {
    if (!window.confirm(`Are you sure you want to delete "${trip?.title}"?`)) return;
    const token = localStorage.getItem("campusTripToken");
    if (token && id) {
      try {
        await deleteTrip(id, token);
        navigate("/trips", { replace: true });
      } catch (e) {
        alert(e.message || "Failed to delete trip.");
      }
    }
  };

  const handleShareTrip = async () => {
    const shareUrl = new URL("/join-trip", window.location.origin);
    if (trip.joinCode) shareUrl.searchParams.set("code", trip.joinCode);
    const shareText = trip.joinCode
      ? `Join my trip "${trip.title}" in CampusTrip with code ${trip.joinCode}.`
      : `View my trip "${trip.title}" in CampusTrip.`;
    setShowMenu(false);

    try {
      if (navigator.share) {
        await navigator.share({
          title: trip.title,
          text: shareText,
          url: shareUrl.toString(),
        });
        setShareMessage("Trip link shared.");
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = `${shareText}\n${shareUrl}`;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setShareMessage("Trip link copied to clipboard.");
    } catch (err) {
      if (err?.name !== "AbortError") {
        setShareMessage("Unable to share the trip link. Please try again.");
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
          className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-sm"
        >
          Back to My Trips
        </Link>
      </MobileShell>
    );
  }

  const isTripOwner = String(trip.owner) === String(currentUserId);

  return (
    <MobileShell showBottomNav={true} contentClassName="bg-white pb-20">
      {/* Header: ← Back     Trip Details     ⋮ */}
      <MobileHeader
        title="Trip Details"
        showBack={true}
        backTo={location.state?.from || "/trips"}
        rightAction={
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 active:bg-slate-200 text-slate-700 transition cursor-pointer"
              aria-label="Options"
            >
              <MoreVertical size={18} />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-1 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-30 animate-in fade-in zoom-in-95">
                  {isTripOwner && (
                    <Link
                      to={`/trips/${trip._id}/edit`}
                      state={{ from: `/trips/${trip._id}` }}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                      onClick={() => setShowMenu(false)}
                    >
                      <Pencil size={15} className="text-slate-500" />
                      <span>Edit Trip</span>
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleShareTrip}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 text-left cursor-pointer transition"
                  >
                    <Share2 size={15} className="text-slate-500" />
                    <span>Share</span>
                  </button>
                  {isTripOwner && (
                    <>
                      <div className="my-1 border-t border-slate-100" />
                      <button
                        type="button"
                        onClick={() => {
                          setShowMenu(false);
                          handleDeleteTrip();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 text-left cursor-pointer transition"
                      >
                        <Trash2 size={15} className="text-red-500" />
                        <span>Delete Trip</span>
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        }
      />

      {shareMessage && (
        <div className="fixed left-1/2 top-16 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-3 text-center text-xs font-medium text-white shadow-xl">
          {shareMessage}
          <button type="button" className="ml-3 text-blue-200 hover:text-white" onClick={() => setShareMessage("")}>Dismiss</button>
        </div>
      )}

      {/* Trip Hero Banner */}
      <div className="relative">
        <div className="h-52 w-full relative overflow-hidden bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600">
          <svg viewBox="0 0 400 240" className="w-full h-full object-cover">
            <defs>
              <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="60%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#1E3A8A" />
              </linearGradient>
            </defs>
            <rect width="400" height="240" fill="url(#heroGrad)" />
            <circle cx="320" cy="50" r="30" fill="#FEF08A" opacity="0.9" />
            <path d="M 0 160 Q 150 120 400 165 L 400 240 L 0 240 Z" fill="#F59E0B" opacity="0.25" />
            <path d="M 0 175 Q 200 155 400 178 L 400 240 L 0 240 Z" fill="#0284C7" opacity="0.7" />
            <path d="M 0 195 Q 180 185 400 200 L 400 240 L 0 240 Z" fill="#0F172A" opacity="0.4" />
          </svg>

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          {/* Hero Content Overlay */}
          <div className="absolute bottom-3.5 left-4 right-4 text-white z-10">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 bg-blue-600/90 backdrop-blur rounded-full text-[10px] font-semibold text-white shadow-xs">
                {trip.status || "Planning"}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-md truncate">
              {trip.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-blue-100">
              <p className="flex items-center gap-1 drop-shadow-xs">
                <MapPin size={13} className="text-blue-200 shrink-0" />
                <span>{trip.destination}</span>
              </p>
              <p className="flex items-center gap-1 drop-shadow-xs">
                <CalendarDays size={13} className="text-blue-200 shrink-0" />
                <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="px-4 sm:px-6 py-5 space-y-5">
        {/* Quick Action Grid (4 Actions) */}
        <div>
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            <Link
              to="/schedule"
              state={{ from: `/trips/${trip._id}`, tripId: trip._id }}
              className="flex flex-col items-center justify-center p-2.5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-indigo-50/50 hover:border-indigo-100 active:scale-95 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                <Calendar size={18} strokeWidth={2.2} />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 truncate w-full text-center">Schedule</span>
            </Link>

            <Link
              to="/budget"
              state={{ from: `/trips/${trip._id}`, tripId: trip._id }}
              className="flex flex-col items-center justify-center p-2.5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-purple-50/50 hover:border-purple-100 active:scale-95 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                <Wallet size={18} strokeWidth={2.2} />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 truncate w-full text-center">Budget</span>
            </Link>

            <Link
              to="/checklist"
              state={{ from: `/trips/${trip._id}`, tripId: trip._id }}
              className="flex flex-col items-center justify-center p-2.5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-teal-50/50 hover:border-teal-100 active:scale-95 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                <CheckSquare size={18} strokeWidth={2.2} />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 truncate w-full text-center">Checklist</span>
            </Link>

            <Link
              to="/members"
              state={{ from: `/trips/${trip._id}`, tripId: trip._id }}
              className="flex flex-col items-center justify-center p-2.5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-blue-50/50 hover:border-blue-100 active:scale-95 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                <Users size={18} strokeWidth={2.2} />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 truncate w-full text-center">Members</span>
            </Link>
          </div>
        </div>

        <WeatherCard
          data={weather}
          error={weatherError}
          loading={weatherLoading}
          title={`${weather?.mode === "forecast" ? "Forecast for" : "Weather in"} ${weatherLocation}`}
        />

        {/* Trip Information Section with District and Tambon */}
        <div className="bg-slate-50/80 rounded-3xl p-4 sm:p-5 border border-slate-100">
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-sm font-bold text-slate-900">Trip Information</h2>
            {isTripOwner && (
              <Link
                to={`/trips/${trip._id}/edit`}
                state={{ from: `/trips/${trip._id}` }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <Pencil size={12} />
                <span>Edit</span>
              </Link>
            )}
          </div>

          <div className="divide-y divide-slate-200/60 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500">Destination</span>
              <span className="font-semibold text-slate-800 text-right">{trip.destination}</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500">District (Amphoe)</span>
              <span className="font-semibold text-slate-800 text-right">{trip.district || "—"}</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500">Tambon (Subdistrict)</span>
              <span className="font-semibold text-slate-800 text-right">{trip.tambon || "—"}</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500">Transportation</span>
              <span className="font-semibold text-slate-800 text-right">{trip.transportation || "Bus"}</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500">Trip Budget</span>
              <span className="font-semibold text-slate-800 text-right">{formatCurrency(trip.budget)}</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-slate-500">Trip Dates</span>
              <span className="font-semibold text-slate-800 text-right">
                {formatDateRange(trip.startDate, trip.endDate)}
              </span>
            </div>

            {trip.description && (
              <div className="pt-2.5">
                <span className="text-slate-500 block mb-1">Description</span>
                <p className="text-slate-700 leading-relaxed text-xs whitespace-pre-line bg-white/70 rounded-xl p-2.5 border border-slate-100">
                  {trip.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
