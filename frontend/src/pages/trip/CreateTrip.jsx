import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import { createTrip } from "../../api/authApi";

const initialForm = {
  title: "",
  destination: "",
  startDate: "",
  endDate: "",
  transportation: "Bus",
  budget: "",
  members: "",
  description: "",
};

function CreateTrip() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      const token = localStorage.getItem("campusTripToken");

      if (!token) {
        navigate("/login");
        return;
      }

      await createTrip(
        {
          title: formData.title,
          destination: formData.destination,
          startDate: formData.startDate,
          endDate: formData.endDate,
          transportation: formData.transportation,
          budget: Number(formData.budget),
          members: Number(formData.members),
          description: formData.description,
          status: "Planning",
        },
        token
      );

      navigate("/trips");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex flex-1 flex-col gap-8 p-6 pt-20 md:p-8">

        <div>
          <Link
            to="/trips"
            className="text-sm font-medium text-blue-700 hover:underline"
          >
            ← Back to My Trips
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-[#1E3A8A] md:text-4xl">
            Create New Trip
          </h1>

          <p className="mt-2 text-gray-500">
            Fill in the information below to create a new campus trip.
          </p>
        </div>

        <div className="max-w-4xl rounded-3xl bg-white p-6 shadow-lg md:p-8">

          <h2 className="mb-6 text-2xl font-semibold text-[#1E3A8A]">
            Trip Information
          </h2>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

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
                placeholder="e.g. Bangkok University Tour"
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
                placeholder="Bangkok, Thailand"
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

            {/* Budget + Members */}
            <div className="grid gap-6 md:grid-cols-2">

              <div>
                <label className="mb-2 block font-medium">
                  Budget (THB)
                </label>

                <input
                  required
                  name="budget"
                  min="1"
                  type="number"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="10000"
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  Maximum Members
                </label>

                <input
                  required
                  name="members"
                  min="1"
                  type="number"
                  value={formData.members}
                  onChange={handleChange}
                  placeholder="20"
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
                placeholder="Write a short description..."
                className="w-full rounded-xl border px-4 py-3"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-3">

              <Link
                to="/trips"
                className="rounded-xl border border-gray-300 px-6 py-3 hover:bg-gray-100"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-[#1E3A8A] px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Trip"}
              </button>

            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateTrip;