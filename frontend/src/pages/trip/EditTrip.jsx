import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import MobileShell from "../../components/layout/MobileShell";
import MobileHeader from "../../components/layout/MobileHeader";
import { getTrip, updateTrip } from "../../api/authApi";

export default function EditTrip() {
  const navigate = useNavigate();
  const location = useLocation();
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
    description: "",
    status: "Planning",
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
            description: data.trip.description || "",
            status: data.trip.status || "Planning",
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
      if (location.state?.from && window.history.state?.idx > 0) {
        navigate(-1);
      } else {
        navigate(`/trips/${id}`, { replace: true });
      }
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
    <MobileShell showBottomNav={false} contentClassName="bg-slate-50/60 pb-16">
      {/* Top Header: ← Back     Edit Trip */}
      <MobileHeader
        title="Edit Trip"
        showBack={true}
        backTo={location.state?.from || `/trips/${id}`}
      />

      <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-5 space-y-5">
        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-600">
            {error}
          </div>
        )}

        {/* Section 1: Basic Information */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Basic Information
          </h2>

          {/* Trip Name */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Trip Name *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Trip Name"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
            />
          </div>

          {/* Destination */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Destination *
            </label>
            <input
              type="text"
              name="destination"
              required
              value={formData.destination}
              onChange={handleChange}
              placeholder="Destination"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
            />
          </div>

          {/* District & Tambon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                District (Amphoe)
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="District"
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
                placeholder="Tambon"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Trip Details */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Trip Details
          </h2>

          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
            >
              <option value="Planning">Planning</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
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
                value={formData.endDate}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Transportation */}
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
              <option value="Train">Train</option>
              <option value="Bus">Bus</option>
              <option value="Van">Van</option>
              <option value="Car">Car</option>
              <option value="Flight">Flight</option>
              <option value="Boat">Boat</option>
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
              value={formData.budget}
              onChange={handleChange}
              placeholder="e.g. 5000"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Trip Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Notes, packing reminders, or trip objectives..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none transition resize-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={updating}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-2xl shadow-lg shadow-blue-500/25 active:scale-[0.99] transition disabled:opacity-70 cursor-pointer"
          >
            {updating ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </MobileShell>
  );
}
