import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import MobileShell from "../../components/layout/MobileShell";
import { createTrip } from "../../api/authApi";

export default function CreateTrip() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    district: "",
    tambon: "",
    startDate: "",
    endDate: "",
    transportation: "Train",
    budget: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      const token = localStorage.getItem("campusTripToken");
      if (!token) {
        navigate("/login");
        return;
      }

      await createTrip(
        {
          ...formData,
          description: formData.description || `${formData.title} adventure in ${formData.destination}`,
          budget: Number(formData.budget) || 10000,
          members: 4,
          status: "Planning",
        },
        token
      );
      navigate("/trips");
    } catch (err) {
      setError(err.message || "Unable to create trip.");
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-lg font-bold text-slate-900">Create Trip</h1>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Basic Information
        </h2>

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
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none transition"
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
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none transition"
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
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none transition"
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
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Dates (2 columns) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Start Date
            </label>
            <div className="relative flex items-center">
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              End Date
            </label>
            <div className="relative flex items-center">
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
              />
            </div>
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
            placeholder="e.g. 10000"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none transition"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 pb-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-500/25 active:scale-[0.99] transition disabled:opacity-70"
          >
            {loading ? "Creating..." : "Create Trip"}
          </button>
        </div>
      </form>
    </MobileShell>
  );
}
