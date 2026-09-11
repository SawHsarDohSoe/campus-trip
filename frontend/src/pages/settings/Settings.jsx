import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, CircleDollarSign, Users } from "lucide-react";
import MobileHeader from "../../components/layout/MobileHeader";
import MobileShell from "../../components/layout/MobileShell";
import { getSettings, updateSettings } from "../../api/authApi";

const options = [
  { key: "tripUpdates", label: "Trip updates", detail: "Schedule and trip status changes", icon: Bell, tone: "bg-blue-50 text-blue-600" },
  { key: "budgetAlerts", label: "Budget alerts", detail: "Expense and budget activity", icon: CircleDollarSign, tone: "bg-amber-50 text-amber-600" },
  { key: "memberInvitations", label: "Member invitations", detail: "Join and collaboration updates", icon: Users, tone: "bg-emerald-50 text-emerald-600" },
];

export default function Settings() {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState({
    tripUpdates: true,
    budgetAlerts: true,
    memberInvitations: true,
  });
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState("");
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
        if (data.notifications) setNotifications(data.notifications);
      } catch (err) {
        setError(err.message || "Unable to load settings.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

  const toggle = async (key) => {
    const token = localStorage.getItem("campusTripToken");
    if (!token || savingKey) return;
    const previous = notifications;
    const next = { ...notifications, [key]: !notifications[key] };
    setNotifications(next);
    setSavingKey(key);
    setError("");
    try {
      await updateSettings({ notifications: next }, token);
    } catch (err) {
      setNotifications(previous);
      setError(err.message || "Unable to save settings.");
    } finally {
      setSavingKey("");
    }
  };

  return (
    <MobileShell showBottomNav contentClassName="bg-slate-50/60 pb-20">
      <MobileHeader title="Settings" showBack backTo={location.state?.from || "/profile"} />
      <div className="mx-auto w-full max-w-2xl space-y-4 px-4 py-5 sm:px-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
          <p className="mt-1 text-xs text-slate-500">Choose which CampusTrip updates you receive.</p>
        </div>
        {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">{error}</div>}
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm divide-y divide-slate-100">
          {loading ? (
            <div className="h-48 animate-pulse bg-slate-100" />
          ) : options.map(({ key, label, detail, icon: Icon, tone }) => (
            <div key={key} className="flex items-center gap-3 p-4 sm:p-5">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                <Icon size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800">{label}</p>
                <p className="text-xs text-slate-500">{detail}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={notifications[key]}
                aria-label={`Toggle ${label}`}
                disabled={Boolean(savingKey)}
                onClick={() => toggle(key)}
                className={`relative h-7 w-12 shrink-0 rounded-full p-1 transition ${notifications[key] ? "bg-blue-600" : "bg-slate-300"} disabled:opacity-60`}
              >
                <span className={`block h-5 w-5 rounded-full bg-white shadow transition-transform ${notifications[key] ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}
