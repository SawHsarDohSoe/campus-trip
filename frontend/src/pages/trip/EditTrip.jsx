import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MobileShell from "../../components/layout/MobileShell";
import { getTrip, updateTrip } from "../../api/authApi";

export default function EditTrip() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    district: "",
    tambon: "",
    startDate: "",
    endDate: "",
    transportation: "Bus",
    budget: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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
          setFormData({
            title: data.trip.title || "",
            destination: data.trip.destination || "",
            district: data.trip.district || "",
            tambon: data.trip.tambon || "",
            startDate: data.trip.startDate ? data.trip.startDate.split("T")[0] : "",
            endDate: data.trip.endDate ? data.trip.endDate.split("T")[0] : "",
            transportation: data.trip.transportation || "Bus",
            budget: data.trip.budget || "",
          });
        }
      } catch (err) {
        setError(err.message || "Unable to load trip.");
      } finally {
        setLoading(false);
      }
    };

    loadTripData();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("campusTripToken");
    if (!token || !id) return;

    try {
      setUpdating(true);
      await updateTrip(
        id,
        {
          ...formData,
          budget: Number(formData.budget),
        },
        token
      );
      navigate(`/trips/${id}`);
    } catch (err) {
      setError(err.message || "Failed to update trip.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <MobileShell showBottomNav={false} contentClassName="bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </MobileShell>
    );
  }

  return (
    <MobileShell showBottomNav={false} contentClassName="bg-white">
      {/* Top Header */}
      <div className="bg-white px-5 pt-3 pb-3 flex items-center gap-3 border-b border-slate-100 sticky top-0 z-20">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-700 transition"
          aria-label="Back"
        >
          <ArrowLeft size={19} />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Edit Trip</h1>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-600">
            {error}
          </div>
        )}

        {/* Trip Name */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Trip Name
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Pattaya Trip"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
          />
        </div>

        {/* Destination */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Destination
          </label>
          <input
            type="text"
            name="destination"
            required
            value={formData.destination}
            onChange={handleChange}
            placeholder="e.g. Chon Buri, Thailand"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
          />
        </div>

        {/* District & Tambon (2 columns) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              District (Amphoe)
            </label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              placeholder="e.g. Pattaya"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Tambon (Subdistrict)
            </label>
            <input
              type="text"
              name="tambon"
              value={formData.tambon}
              onChange={handleChange}
              placeholder="e.g. Pattaya"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Dates (2 columns) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              required
              value={formData.startDate}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              required
              value={formData.endDate}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Transportation Dropdown */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Transportation
          </label>
          <select
            name="transportation"
            value={formData.transportation}
            onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
          >
            <option value="Bus">Bus</option>
            <option value="Van">Van</option>
            <option value="Train">Train</option>
            <option value="Airplane">Airplane</option>
          </select>
        </div>

        {/* Trip Budget */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Trip Budget (THB)
          </label>
          <input
            type="number"
            name="budget"
            required
            value={formData.budget}
            onChange={handleChange}
            placeholder="e.g. 10000"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
          />
        </div>

        {/* Update Button */}
        <div className="pt-4 pb-6">
          <button
            type="submit"
            disabled={updating}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-500/25 active:scale-[0.99] transition disabled:opacity-70"
          >
            {updating ? "Updating..." : "Update Trip"}
          </button>
        </div>
      </form>
    </MobileShell>
  );
}
