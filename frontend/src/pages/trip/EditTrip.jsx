import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import { getTrip, updateTrip } from "../../api/authApi";

function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTrip = async () => {
      try {
        const token = localStorage.getItem("campusTripToken");

        if (!token) {
          navigate("/login");
          return;
        }

        const data = await getTrip(id, token);

        const trip = data.trip;

        setFormData({
          title: trip.title,
          destination: trip.destination,
          startDate: trip.startDate.slice(0, 10),
          endDate: trip.endDate.slice(0, 10),
          transportation: trip.transportation,
          status: trip.status,
          budget: trip.budget,
          members: trip.members,
          description: trip.description,
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [id, navigate]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      const token = localStorage.getItem("campusTripToken");

      if (!token) {
        navigate("/login");
        return;
      }

      await updateTrip(
        id,
        {
          title: formData.title,
          destination: formData.destination,
          startDate: formData.startDate,
          endDate: formData.endDate,
          transportation: formData.transportation,
          status: formData.status,
          budget: Number(formData.budget),
          members: Number(formData.members),
          description: formData.description,
        },
        token
      );

      navigate(`/trips/${id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />

        <main className="flex flex-1 items-center justify-center p-8">
          <p className="text-gray-500">
            Loading trip...
          </p>
        </main>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />

        <main className="flex flex-1 flex-col items-center justify-center p-8">
          <h1 className="text-2xl font-bold text-[#1E3A8A]">
            Trip not found
          </h1>

          <p className="mt-2 text-gray-500">
            {error || "This trip may have been deleted."}
          </p>

          <Link
            to="/trips"
            replace
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <ArrowLeft size={18} />
            Back to My Trips
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex flex-1 flex-col gap-8 p-6 pt-20 md:p-8">

        {/* Header */}
        <div>
          <Link
            to={`/trips/${id}`}
            replace
            className="inline-flex items-center gap-2 font-medium text-blue-700 hover:underline"
          >
            <ArrowLeft size={18} />
            Back to Trip Details
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-[#1E3A8A] md:text-4xl">
            Edit Trip
          </h1>

          <p className="mt-2 text-gray-500">
            Update the details of your campus trip.
          </p>
        </div>

        {/* Form */}
        <div className="max-w-4xl rounded-3xl bg-white p-6 shadow-lg md:p-8">

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Trip Name */}
            <div>
              <label className="mb-2 block font-medium">
                Trip Name
              </label>

              <input
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-[#1E3A8A]"
              />
            </div>

            {/* Destination */}
            <div>
              <label className="mb-2 block font-medium">
                Destination
              </label>

              <input
                required
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-[#1E3A8A]"
              />
            </div>

            {/* Dates */}
            <div className="grid gap-6 md:grid-cols-2">

              <div>
                <label className="mb-2 block font-medium">
                  Start Date
                </label>

                <input
                  required
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  End Date
                </label>

                <input
                  required
                  name="endDate"
                  type="date"
                  min={formData.startDate}
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

            </div>

            {/* Transportation */}
            <div>
              <label className="mb-2 block font-medium">
                Transportation
              </label>

              <select
                name="transportation"
                value={formData.transportation}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
              >
                <option>Bus</option>
                <option>Van</option>
                <option>Train</option>
                <option>Airplane</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block font-medium">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
              >
                <option value="Planning">Planning</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Budget + Members */}
            <div className="grid gap-6 md:grid-cols-2">

              <div>
                <label className="mb-2 block font-medium">
                  Budget (THB)
                </label>

                <input
                  required
                  min="0"
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  Maximum Members
                </label>

                <input
                  required
                  min="1"
                  name="members"
                  type="number"
                  value={formData.members}
                  onChange={handleChange}
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block font-medium">
                Trip Description
              </label>

              <textarea
                required
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-3">

              <Link
                to={`/trips/${id}`}
                className="rounded-xl border border-gray-300 px-6 py-3 hover:bg-gray-100"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#1E3A8A] px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

            </div>

          </form>

        </div>
      </main>
    </div>
  );
}

export default EditTrip;
