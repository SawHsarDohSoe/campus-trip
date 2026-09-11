import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  ChevronDown,
  Plus,
  Trash2,
  Calendar,
  Pencil,
} from "lucide-react";
import MobileShell from "../../components/layout/MobileShell";
import MobileHeader from "../../components/layout/MobileHeader";
import {
  getTrips,
  getSchedules,
  createSchedule,
  deleteSchedule,
  updateSchedule,
} from "../../api/authApi";

export default function Schedule() {
  const navigate = useNavigate();
  const location = useLocation();
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [isDayOpen, setIsDayOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [, setLoading] = useState(true);
  const [newActivity, setNewActivity] = useState({
    time: "09:00",
    activity: "",
  });

  useEffect(() => {
    const loadTrips = async () => {
      const token = localStorage.getItem("campusTripToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const data = await getTrips(token);
        if (data?.trips?.length) {
          setTrips(data.trips);
          const requestedTrip = location.state?.tripId;
          setSelectedTripId(
            data.trips.some((trip) => trip._id === requestedTrip)
              ? requestedTrip
              : data.trips[0]._id
          );
        }
      } catch (err) {
        console.error("Error loading trips:", err);
      } finally {
        setLoading(false);
      }
    };
    loadTrips();
  }, [navigate, location.state?.tripId]);

  const fetchSchedules = async () => {
    const token = localStorage.getItem("campusTripToken");
    if (!token || !selectedTripId) return;

    try {
      const data = await getSchedules(selectedTripId, token);
      if (data?.schedules) {
        setSchedules(data.schedules);
      }
    } catch (err) {
      console.error("Failed to load schedules:", err);
    }
  };

  useEffect(() => {
    if (!selectedTripId) {
      setSchedules([]);
      return;
    }
    fetchSchedules();
  }, [selectedTripId]);

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!newActivity.activity || !selectedTripId) return;

    const token = localStorage.getItem("campusTripToken");
    if (!token) return;

    try {
      const activeTrip = trips.find((t) => t._id === selectedTripId);
      const tripDate = activeTrip?.startDate
        ? new Date(activeTrip.startDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      const payload = {
        date: editingSchedule?.date || tripDate,
        time: newActivity.time,
        activity: newActivity.activity,
      };
      if (editingSchedule) {
        await updateSchedule(selectedTripId, editingSchedule._id, payload, token);
      } else {
        await createSchedule(selectedTripId, payload, token);
      }
      setNewActivity({ time: "09:00", activity: "" });
      setEditingSchedule(null);
      setShowModal(false);
      await fetchSchedules();
    } catch (err) {
      alert(err.message || "Failed to create activity.");
    }
  };

  const handleDeleteActivity = async (scheduleId) => {
    const token = localStorage.getItem("campusTripToken");
    if (!token || !selectedTripId) return;

    try {
      await deleteSchedule(selectedTripId, scheduleId, token);
      setSchedules((prev) => prev.filter((s) => s._id !== scheduleId));
    } catch (err) {
      alert(err.message || "Failed to delete activity.");
    }
  };

  const activeTrip = trips.find((t) => t._id === selectedTripId);

  return (
    <MobileShell showBottomNav={true} contentClassName="bg-slate-50/60 pb-20">
      {/* Top Header: ← Back     Schedule */}
      <MobileHeader title="Schedule" showBack backTo={location.state?.from || "/dashboard"} />

      <div className="px-4 sm:px-6 py-4 space-y-4">
        {/* Trip Switcher Dropdown */}
        {trips.length > 0 ? (
          <div className="relative">
            <select
              value={selectedTripId}
              onChange={(e) => setSelectedTripId(e.target.value)}
              className="w-full bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-xl py-2.5 px-3.5 appearance-none focus:outline-none focus:border-blue-600 shadow-sm"
            >
              {trips.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.title}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        ) : (
          <div className="p-6 bg-white rounded-2xl border border-slate-100 text-center">
            <Calendar size={28} className="mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-700">No Trips Created</p>
            <p className="text-[11px] text-slate-400 mt-1">Create a trip first to add schedules.</p>
            <Link
              to="/trips/create"
              className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
            >
              Create Trip
            </Link>
          </div>
        )}

        {/* Day Accordion Card */}
        {selectedTripId && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <button
              onClick={() => setIsDayOpen(!isDayOpen)}
              className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 transition"
            >
              <span>
                {activeTrip?.startDate
                  ? `${new Date(activeTrip.startDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })} (Day 1)`
                  : "Trip Schedule"}
              </span>
              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform duration-200 ${
                  isDayOpen ? "transform rotate-180" : ""
                }`}
              />
            </button>

            {isDayOpen && (
              <div className="p-4 pt-1 border-t border-slate-50">
                {schedules.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-xs text-slate-400">No activities scheduled yet</p>
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-5 my-2">
                    <div className="absolute left-[7px] top-2 bottom-3 w-[2px] bg-slate-200"></div>

                    {schedules.map((item, idx) => {
                      const isFirst = idx === 0;
                      return (
                        <div key={item._id} className="relative flex items-center justify-between group">
                          <div
                            className={`absolute -left-[23px] w-4 h-4 rounded-full border-2 border-white ring-2 ${
                              isFirst
                                ? "bg-emerald-500 ring-emerald-100"
                                : "bg-blue-600 ring-blue-100"
                            } flex items-center justify-center`}
                          ></div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-900 w-12 shrink-0">
                              {item.time || "10:00"}
                            </span>
                            <span className="text-xs text-slate-700 font-medium">
                              {item.activity}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingSchedule(item);
                                setNewActivity({ time: item.time || "09:00", activity: item.activity || "" });
                                setShowModal(true);
                              }}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition"
                              aria-label="Edit activity"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteActivity(item._id)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                              aria-label="Delete activity"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Add Activity Button */}
                <div className="mt-5 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setEditingSchedule(null);
                      setNewActivity({ time: "09:00", activity: "" });
                      setShowModal(true);
                    }}
                    className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition active:scale-98"
                  >
                    <Plus size={15} strokeWidth={2.5} />
                    <span>Add Activity</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Activity Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">{editingSchedule ? "Edit Activity" : "Add Activity"}</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingSchedule(null);
                }}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddActivity} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  required
                  value={newActivity.time}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, time: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Activity
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Depart from campus"
                  value={newActivity.activity}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, activity: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition"
                >
                  {editingSchedule ? "Save Changes" : "Save Activity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MobileShell>
  );
}
