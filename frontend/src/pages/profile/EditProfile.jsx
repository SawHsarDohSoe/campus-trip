import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MobileHeader from "../../components/layout/MobileHeader";
import MobileShell from "../../components/layout/MobileShell";
import { getSettings, updateSettings } from "../../api/authApi";

export default function EditProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", university: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("campusTripToken");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }
      try {
        const data = await getSettings(token);
        setForm({
          name: data.profile?.name || "",
          email: data.profile?.email || "",
          university: data.profile?.university || "",
        });
      } catch (err) {
        setError(err.message || "Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("campusTripToken");
    if (!token) return;
    try {
      setSaving(true);
      setError("");
      const data = await updateSettings({ profile: form }, token);
      const stored = JSON.parse(localStorage.getItem("campusTripCurrentUser") || "{}");
      localStorage.setItem(
        "campusTripCurrentUser",
        JSON.stringify({ ...stored, ...data.profile })
      );
      if (location.state?.from && window.history.state?.idx > 0) {
        navigate(-1);
      } else {
        navigate("/profile", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Unable to save your profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <MobileShell showBottomNav={false} contentClassName="bg-slate-50/60">
      <MobileHeader title="Edit Profile" showBack backTo={location.state?.from || "/profile"} />
      <div className="mx-auto w-full max-w-2xl px-4 py-5 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
          {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">{error}</div>}
          {loading ? (
            <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
          ) : (
            <>
              {[
                ["Full name", "name", "text"],
                ["Email", "email", "email"],
                ["University", "university", "text"],
              ].map(([label, name, type]) => (
                <label key={name} className="block text-xs font-semibold text-slate-700">
                  {label}
                  <input
                    type={type}
                    required={name !== "university"}
                    value={form[name]}
                    onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))}
                    className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              ))}
              <button
                type="submit"
                disabled={saving}
                className="min-h-11 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </>
          )}
        </form>
      </div>
    </MobileShell>
  );
}
