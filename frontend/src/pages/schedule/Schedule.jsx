import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import {
  getTrips,
  getSchedules,
  createSchedule,
   updateSchedule,
  deleteSchedule,
} from "../../api/authApi";

const emptyForm = {
  date: "",
  time: "",
  activity: "",
  location: "",
  notes: "",
};

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-GB",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

function Schedule() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState("");

  const [schedules, setSchedules] = useState([]);

  const [formData, setFormData] =
    useState(emptyForm);

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingSchedule, setEditingSchedule] = useState(null);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const token =
          localStorage.getItem("campusTripToken");

        if (!token) {
          navigate("/login");
          return;
        }

        const data = await getTrips(token);

        setTrips(data.trips);

        if (data.trips.length > 0) {
          setSelectedTripId(data.trips[0]._id);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, [navigate]);

  useEffect(() => {
    if (!selectedTripId) return;

    const loadSchedules = async () => {
      try {
        const token =
          localStorage.getItem("campusTripToken");

        const data = await getSchedules(
          selectedTripId,
          token
        );

        setSchedules(data.schedules);
      } catch (error) {
        setError(error.message);
      }
    };

    loadSchedules();
  }, [selectedTripId]);

  const selectedTrip = useMemo(
    () =>
      trips.find(
        (trip) => trip._id === selectedTripId
      ),
    [trips, selectedTripId]
  );

  const sortedSchedules = useMemo(
    () =>
      [...schedules].sort((a, b) => {
        const first = new Date(
          `${a.date}T${a.time}`
        );

        const second = new Date(
          `${b.date}T${b.time}`
        );

        return first - second;
      }),
    [schedules]
  );

  const handleTripChange = (event) => {
    setSelectedTripId(event.target.value);
    setIsFormOpen(false);
    setError("");
  };

  const handleEdit = (schedule) => {
  setEditingSchedule(schedule);

  setFormData({
    date: schedule.date
      ? new Date(schedule.date).toISOString().split("T")[0]
      : "",
    time: schedule.time || "",
    activity: schedule.activity || "",
    location: schedule.location || "",
    notes: schedule.notes || "",
  });

  setError("");
  setIsFormOpen(true);
};

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  if (!selectedTripId) return;

  try {
    setSaving(true);
    setError("");

    const token = localStorage.getItem("campusTripToken");

    if (!token) {
      navigate("/login");
      return;
    }

    if (editingSchedule) {
      const data = await updateSchedule(
        selectedTripId,
        editingSchedule._id,
        formData,
        token
      );

      setSchedules((current) =>
        current.map((item) =>
          item._id === editingSchedule._id
            ? data.schedule
            : item
        )
      );
    } else {
      const data = await createSchedule(
        selectedTripId,
        formData,
        token
      );

      setSchedules((current) => [
        ...current,
        data.schedule,
      ]);
    }

    setFormData(emptyForm);
    setEditingSchedule(null);
    setIsFormOpen(false);
  } catch (error) {
    setError(error.message);
  } finally {
    setSaving(false);
  }
};

  const handleDelete = async (scheduleId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this schedule item?"
    );

    if (!confirmed) return;

    try {
      const token =
        localStorage.getItem("campusTripToken");

      await deleteSchedule(
        selectedTripId,
        scheduleId,
        token
      );

      setSchedules(
        schedules.filter(
          (item) => item._id !== scheduleId
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />

        <main className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">
            Loading schedule...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex flex-1 flex-col gap-8 p-6 pt-20 md:p-8">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

          <div>
            <p className="text-sm font-semibold text-blue-700">
              CampusTrip
            </p>

            <h1 className="mt-1 text-3xl font-bold text-[#1E3A8A] md:text-4xl">
              Trip Schedule
            </h1>

            <p className="mt-2 text-gray-500">
              Organize every activity before and during your trip.
            </p>
          </div>

          <button
            type="button"
            disabled={!selectedTripId}
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            <Plus size={20} />
            Add Schedule
          </button>

        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Trip selector */}
        <section className="rounded-3xl bg-white p-6 shadow-lg">

          <label className="block font-semibold text-gray-700">
            Select Trip
          </label>

          <select
            value={selectedTripId}
            onChange={handleTripChange}
            className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#1E3A8A]"
          >
            {trips.map((trip) => (
              <option
                key={trip._id}
                value={trip._id}
              >
                {trip.title} — {trip.destination}
              </option>
            ))}
          </select>

        </section>

        {/* Trip information */}
        {selectedTrip && (
          <section className="rounded-3xl bg-[#E5F6FD] p-7 shadow-lg">

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div>
                <p className="text-sm font-semibold text-blue-700">
                  CURRENT TRIP
                </p>

                <h2 className="mt-1 text-2xl font-bold text-[#1E3A8A]">
                  {selectedTrip.title}
                </h2>

                <p className="mt-2 flex items-center gap-2 text-gray-600">
                  <MapPin size={17} />
                  {selectedTrip.destination}
                </p>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <CalendarDays size={18} />

                {formatDate(
                  selectedTrip.startDate
                )}

                {" – "}

                {formatDate(
                  selectedTrip.endDate
                )}
              </div>

            </div>

          </section>
        )}

        {/* Schedule */}
        <section className="rounded-3xl bg-white p-6 shadow-lg md:p-8">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-bold text-[#1E3A8A]">
                Itinerary
              </h2>

              <p className="mt-1 text-gray-500">
                {sortedSchedules.length}{" "}
                {sortedSchedules.length === 1
                  ? "activity"
                  : "activities"}{" "}
                planned.
              </p>
            </div>

            <CalendarDays
              size={28}
              className="text-[#1E3A8A]"
            />

          </div>

          {sortedSchedules.length === 0 ? (
            <div className="mt-8 rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">

              <CalendarDays
                size={40}
                className="mx-auto text-gray-300"
              />

              <h3 className="mt-4 text-lg font-semibold text-gray-700">
                No schedule yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Add your first activity to build the trip itinerary.
              </p>

              <button
                type="button"
                onClick={() =>
                  setIsFormOpen(true)
                }
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                <Plus size={18} />
                Add Activity
              </button>

            </div>
          ) : (
            <div className="mt-6 space-y-4">

              {sortedSchedules.map(
                (schedule) => (
                  <div
                    key={schedule._id}
                    className="rounded-2xl border border-gray-100 bg-slate-50 p-5"
                  >

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                      <div className="flex gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E5F6FD] text-[#1E3A8A]">
                          <Clock3 size={22} />
                        </div>

                        <div>

                          <h3 className="text-lg font-bold text-gray-800">
                            {schedule.activity}
                          </h3>

                          <div className="mt-2 flex flex-col gap-1 text-sm text-gray-500 sm:flex-row sm:gap-5">

                            <span className="flex items-center gap-2">
                              <CalendarDays size={15} />
                              {formatDate(
                                schedule.date
                              )}
                            </span>

                            <span className="flex items-center gap-2">
                              <Clock3 size={15} />
                              {schedule.time}
                            </span>

                          </div>

                          {schedule.location && (
                            <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                              <MapPin size={15} />
                              {schedule.location}
                            </p>
                          )}

                          {schedule.notes && (
                            <p className="mt-3 text-sm text-gray-600">
                              {schedule.notes}
                            </p>
                          )}

                        </div>

                      </div>

                      <div className="flex gap-2 self-start">
                      <button
                        type="button"
                        onClick={() => handleEdit(schedule)}
                        className="rounded-xl border border-blue-200 p-3 text-[#1E3A8A] transition hover:bg-blue-50"
                        aria-label="Edit schedule"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(schedule._id)}
                        className="rounded-xl border border-red-200 p-3 text-red-500 transition hover:bg-red-50"
                        aria-label="Delete schedule"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </section>

      </main>

      {/* Add Schedule Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl"
          >

           <h2 className="text-2xl font-bold text-[#1E3A8A]">
            {editingSchedule ? "Edit Schedule" : "Add Schedule"}
          </h2>

            <p className="mt-2 text-sm text-gray-500">
              {editingSchedule
                ? "Update this activity in your trip itinerary."
                : "Add an activity to your trip itinerary."}
            </p>

            <div className="mt-6 space-y-4">

              <input
                required
                name="activity"
                value={formData.activity}
                onChange={handleChange}
                placeholder="Activity name"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#1E3A8A]"
              />

              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Date
                  </label>

                  <input
                    required
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#1E3A8A]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Time
                  </label>

                  <input
                    required
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#1E3A8A]"
                  />
                </div>

              </div>

              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#1E3A8A]"
              />

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Notes (optional)"
                rows="3"
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#1E3A8A]"
              />

            </div>

            <div className="mt-7 flex justify-end gap-3">

              <button
                type="button"
               onClick={() => {
                setIsFormOpen(false);
                setFormData(emptyForm);
                setEditingSchedule(null);
                setError("");
              }}
                className="rounded-xl border border-gray-300 px-5 py-3 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#1E3A8A] px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
               {saving
                ? "Saving..."
                : editingSchedule
                  ? "Save Changes"
                  : "Save Activity"}
              </button>

            </div>

          </form>

        </div>
      )}

    </div>
  );
}

export default Schedule;