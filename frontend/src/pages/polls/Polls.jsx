import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BarChart3, ChevronDown } from "lucide-react";
import MobileHeader from "../../components/layout/MobileHeader";
import MobileShell from "../../components/layout/MobileShell";
import TripPolls from "../trip/TripPolls";
import { getTrips } from "../../api/authApi";

export default function Polls() {
  const navigate = useNavigate();
  const location = useLocation();
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTrips = async () => {
      const token = localStorage.getItem("campusTripToken");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        setLoading(true);
        const data = await getTrips(token);
        const availableTrips = data?.trips || [];
        setTrips(availableTrips);
        const requestedTripId = location.state?.tripId;
        const requestedTrip = availableTrips.find((trip) => trip._id === requestedTripId);
        setSelectedTripId(requestedTrip?._id || availableTrips[0]?._id || "");
      } catch (err) {
        setError(err.message || "Unable to load trips for polling.");
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, [location.state?.tripId, navigate]);

  const activeTrip = trips.find((trip) => trip._id === selectedTripId);
  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem("campusTripCurrentUser") || "null");
  } catch {
    currentUser = null;
  }
  const isOwner =
    String(activeTrip?.owner?._id || activeTrip?.owner || "") ===
    String(currentUser?._id || currentUser?.id || "");

  return (
    <MobileShell showBottomNav contentClassName="bg-slate-50/60 pb-20">
      <MobileHeader title="Trip Polls" showBack backTo={location.state?.from || "/dashboard"} />

      <div className="space-y-4 px-4 py-4 sm:px-6">
        {trips.length > 0 && (
          <div className="relative">
            <select
              value={selectedTripId}
              onChange={(event) => setSelectedTripId(event.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 shadow-sm outline-none focus:border-blue-600"
            >
              {trips.map((trip) => (
                <option key={trip._id} value={trip._id}>
                  {trip.title}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center text-xs text-slate-500 shadow-sm">
            Loading trips...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-600">
            {error}
          </div>
        ) : activeTrip ? (
          <TripPolls tripId={activeTrip._id} isOwner={isOwner} tripStatus={activeTrip.status} />
        ) : (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <BarChart3 size={28} className="mx-auto text-slate-300" />
            <p className="mt-2 text-xs font-semibold text-slate-700">No active trip available</p>
            <p className="mt-1 text-[11px] text-slate-400">Create or join a trip before starting a poll.</p>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
