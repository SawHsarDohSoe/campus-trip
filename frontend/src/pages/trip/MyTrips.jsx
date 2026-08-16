import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import { getTrips, deleteTrip } from "../../api/authApi";

const currency = new Intl.NumberFormat("en-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
});

function formatDate(startDate, endDate) {
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  return `${new Date(startDate).toLocaleDateString(
    "en-GB",
    options
  )} – ${new Date(endDate).toLocaleDateString("en-GB", options)}`;
}

function MyTrips() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Trips");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const token = localStorage.getItem("campusTripToken");

        if (!token) {
          navigate("/login");
          return;
        }

        const data = await getTrips(token);

        setTrips(data.trips);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, [navigate]);

  const displayedTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchesSearch = `${trip.title} ${trip.destination}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        status === "All Trips" || trip.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [trips, search, status]);

  const handleDelete = async (trip) => {
    const confirmed = window.confirm(
      `Delete "${trip.title}"?`
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("campusTripToken");

      if (!token) {
        navigate("/login");
        return;
      }

      await deleteTrip(trip._id, token);

      setTrips((currentTrips) =>
        currentTrips.filter((item) => item._id !== trip._id)
      );
    } catch (error) {
      setError(error.message);
    }
  };

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
              My Trips
            </h1>

            <p className="mt-2 text-gray-500">
              Manage all your campus trips in one place.
            </p>
          </div>

          <Link
            to="/trips/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700"
          >
            <Plus size={20} />
            New Trip
          </Link>

        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col gap-4 md:flex-row">

          <label className="relative flex-1">

            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              type="search"
              placeholder="Search trips..."
              className="w-full rounded-xl border bg-white py-3 pl-11 pr-4 outline-none focus:border-[#1E3A8A]"
            />

          </label>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-xl border bg-white px-4 py-3 outline-none focus:border-[#1E3A8A]"
          >
            <option>All Trips</option>
            <option>Upcoming</option>
            <option>Planning</option>
            <option>Completed</option>
          </select>

        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
            <p className="text-gray-500">
              Loading your trips...
            </p>
          </div>
        )}

        {/* Trips */}
        {!loading && displayedTrips.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {displayedTrips.map((trip) => (

              <article
                key={trip._id}
                className="overflow-hidden rounded-3xl bg-white shadow-lg"
              >

                {/* Image placeholder */}
                <div className="flex h-40 items-center justify-center bg-[#E5F6FD] text-5xl">
                  🚌
                </div>

                <div className="p-6">

                  <h2 className="text-xl font-bold text-gray-800">
                    {trip.title}
                  </h2>

                  <div className="mt-4 space-y-2 text-sm text-gray-500">

                    <p className="flex items-center gap-2">
                      <MapPin size={16} />
                      {trip.destination}
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {formatDate(
                        trip.startDate,
                        trip.endDate
                      )}
                    </p>

                    <p className="flex items-center gap-2">
                      <Users size={16} />
                      Up to {trip.members} members
                    </p>

                  </div>

                  <p className="mt-4 font-semibold text-[#1E3A8A]">
                    {currency.format(trip.budget)}
                  </p>

                  <span className="mt-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                    {trip.status}
                  </span>

                  <div className="mt-6 flex gap-3">

                    <Link
                      to={`/trips/${trip._id}`}
                      className="flex-1 rounded-xl bg-[#1E3A8A] py-2 text-center text-white hover:bg-blue-700"
                    >
                      View
                    </Link>

                    <Link
                      to={`/trips/${trip._id}/edit`}
                      aria-label={`Edit ${trip.title}`}
                      className="rounded-xl border border-gray-200 px-3 py-2 text-[#1E3A8A] hover:bg-blue-50"
                    >
                      <Pencil size={18} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(trip)}
                      aria-label={`Delete ${trip.title}`}
                      className="rounded-xl border border-red-200 px-3 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                </div>

              </article>

            ))}

          </div>
        )}

        {/* No trips */}
        {!loading && displayedTrips.length === 0 && (
          <div className="rounded-3xl bg-white p-10 text-center shadow-lg">

            <h2 className="text-xl font-bold text-[#1E3A8A]">
              No trips found
            </h2>

            <p className="mt-2 text-gray-500">
              {search
                ? "Try a different search."
                : "Create your first campus trip."}
            </p>

            {!search && (
              <Link
                to="/trips/create"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                <Plus size={18} />
                Create Trip
              </Link>
            )}

          </div>
        )}

      </main>
    </div>
  );
}

export default MyTrips;