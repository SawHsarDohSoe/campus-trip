import { useEffect, useState } from "react";
import { History, MapPin, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import { getTripHistory } from "../../api/authApi";

function TripHistory() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const token = localStorage.getItem("campusTripToken");

        if (!token) {
          navigate("/login");
          return;
        }

        const data = await getTripHistory(token);
        setTrips(data.trips || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [navigate]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6 pt-20 md:p-10">
        <section className="mx-auto max-w-5xl">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#1E3A8A]">
                <History size={25} />
              </div>

              <div>
                <p className="text-sm font-semibold text-blue-700">
                  CAMPUS TRIP
                </p>

                <h1 className="text-3xl font-bold text-[#1E3A8A]">
                  Trip History
                </h1>
              </div>
            </div>

            <p className="mt-3 text-gray-500">
              View your completed trips and past travel records.
            </p>
          </div>

          {loading && (
            <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
              Loading trip history...
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && trips.length === 0 && (
            <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
              <History
                size={45}
                className="mx-auto text-gray-300"
              />

              <h2 className="mt-4 text-xl font-bold text-gray-700">
                No completed trips yet
              </h2>

              <p className="mt-2 text-gray-500">
                Your finished trips will appear here.
              </p>
            </div>
          )}

          {!loading && !error && trips.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2">
              {trips.map((trip) => (
                <div
                  key={trip._id}
                  className="rounded-3xl bg-white p-6 shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-[#1E3A8A]">
                        {trip.title}
                      </h2>

                      <p className="mt-2 flex items-center gap-2 text-gray-600">
                        <MapPin size={17} />
                        {trip.destination}
                      </p>
                    </div>

                    <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        trip.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                    >
                    {trip.status === "Cancelled" ? "Cancelled" : "Completed"}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">
                    <CalendarDays size={17} />

                    {formatDate(trip.startDate)} –{" "}
                    {formatDate(trip.endDate)}
                  </div>

                  <div className="mt-5 border-t pt-5">
                    <p className="text-sm text-gray-500">
                      Budget
                    </p>

                    <p className="mt-1 text-lg font-bold text-gray-800">
                      THB {Number(trip.budget).toLocaleString()}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/trips/${trip._id}`)}
                    className="mt-5 w-full rounded-xl bg-[#1E3A8A] px-5 py-3 font-semibold text-white hover:bg-blue-700"
                  >
                    View Trip
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default TripHistory;