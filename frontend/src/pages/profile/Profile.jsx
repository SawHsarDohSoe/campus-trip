import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Bell,
  Info,
  HelpCircle,
  History,
  ChevronRight,
  LogOut,
  Settings as SettingsIcon,
  X,
} from "lucide-react";
import MobileShell from "../../components/layout/MobileShell";
import MobileHeader from "../../components/layout/MobileHeader";
import {
  changePassword,
  getCurrentUser,
  getSettings,
  updateSettings,
} from "../../api/authApi";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [passwordError, setPasswordError] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [infoPanel, setInfoPanel] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("campusTripToken");
      const storedUser = localStorage.getItem("campusTripCurrentUser");

      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          setUser(u);
        } catch {
          // ignore
        }
      }

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const [userData, settingsData] = await Promise.allSettled([
          getCurrentUser(token),
          getSettings(token),
        ]);

        if (userData.status === "fulfilled" && userData.value?.user) {
          const u = userData.value.user;
          setUser(u);
          localStorage.setItem("campusTripCurrentUser", JSON.stringify(u));
        }

        if (settingsData.status === "fulfilled" && settingsData.value?.notifications) {
          setNotificationsEnabled(Boolean(settingsData.value.notifications.tripUpdates));
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleToggleNotifications = async () => {
    const token = localStorage.getItem("campusTripToken");
    const nextState = !notificationsEnabled;
    if (!token) return navigate("/login");
    setNotificationsEnabled(nextState);

    try {
      await updateSettings(
        {
          notifications: {
            tripUpdates: nextState,
            budgetAlerts: nextState,
            memberInvitations: nextState,
          },
        },
        token
      );
      setNotice(`Notifications ${nextState ? "enabled" : "disabled"}.`);
    } catch (err) {
      setNotificationsEnabled(!nextState);
      setNotice(err.message || "Unable to update notification settings.");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      localStorage.removeItem("campusTripToken");
      localStorage.removeItem("campusTripCurrentUser");
      navigate("/login");
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("campusTripToken");
    if (!token) return navigate("/login");

    try {
      setSavingPassword(true);
      setPasswordError("");
      const data = await changePassword(passwordForm, token);
      setNotice(data.message || "Password updated successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setShowPasswordForm(false);
    } catch (err) {
      setPasswordError(err.message || "Unable to change password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const initialLetter = (user?.name || "U")[0].toUpperCase();

  return (
    <MobileShell showBottomNav={true} contentClassName="bg-slate-50/60 pb-20">
      {/* Top Header */}
      <MobileHeader showBack={false} />

      <div className="px-4 sm:px-6 py-5 space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Profile</h1>
          <p className="mt-0.5 text-xs text-slate-500">Your account and app preferences.</p>
        </div>
        {notice && (
          <div className="flex items-start justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs text-blue-700">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice("")} aria-label="Dismiss message">
              <X size={15} />
            </button>
          </div>
        )}
        {/* User Card */}
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-blue-600 text-white font-bold text-3xl flex items-center justify-center shadow-lg shadow-blue-500/25 mb-3">
            {initialLetter}
          </div>

          <h2 className="text-lg font-bold text-slate-900">{user?.name || "Student User"}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{user?.email || "user@example.com"}</p>
        </div>

        {/* Menu Options Group */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {/* Edit Profile */}
          <button
            type="button"
            onClick={() => navigate("/profile/edit", { state: { from: "/profile" } })}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <User size={17} />
              </div>
              <span className="text-xs font-semibold text-slate-800">Edit Profile</span>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </button>

          <button
            type="button"
            onClick={() => navigate("/settings", { state: { from: "/profile" } })}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                <SettingsIcon size={17} />
              </div>
              <span className="text-xs font-semibold text-slate-800">Settings</span>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </button>

          <button
            type="button"
            onClick={() => navigate("/trip-history", { state: { from: "/profile" } })}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <History size={17} />
              </div>
              <span className="text-xs font-semibold text-slate-800">Trip History</span>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </button>

          {/* Change Password */}
          <button
            type="button"
            onClick={() => {
              setPasswordError("");
              setShowPasswordForm(true);
            }}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Lock size={17} />
              </div>
              <span className="text-xs font-semibold text-slate-800">Change Password</span>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </button>

          {/* Notifications Toggle */}
          <div className="px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Bell size={17} />
              </div>
              <span className="text-xs font-semibold text-slate-800">Notifications</span>
            </div>
            <button
              type="button"
              onClick={handleToggleNotifications}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
                notificationsEnabled ? "bg-blue-600" : "bg-slate-300"
              }`}
              aria-label="Toggle notifications"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                  notificationsEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* About */}
          <button
            type="button"
            onClick={() => setInfoPanel("about")}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Info size={17} />
              </div>
              <span className="text-xs font-semibold text-slate-800">About</span>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </button>

          {/* Help & Support */}
          <button
            type="button"
            onClick={() => setInfoPanel("help")}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <HelpCircle size={17} />
              </div>
              <span className="text-xs font-semibold text-slate-800">Help & Support</span>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </button>
        </div>

        {showPasswordForm && (
          <div className="fixed inset-0 z-50 flex items-end bg-slate-900/40 p-4 sm:items-center sm:justify-center">
            <form onSubmit={handleChangePassword} className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Change Password</h2>
                  <p className="mt-0.5 text-xs text-slate-500">Enter your current password and choose a new one.</p>
                </div>
                <button type="button" onClick={() => setShowPasswordForm(false)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="Close">
                  <X size={18} />
                </button>
              </div>
              {passwordError && <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">{passwordError}</p>}
              <label className="mb-3 block text-xs font-semibold text-slate-700">
                Current password
                <input type="password" required value={passwordForm.currentPassword} onChange={(event) => setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:bg-white" />
              </label>
              <label className="block text-xs font-semibold text-slate-700">
                New password
                <input type="password" required minLength={6} value={passwordForm.newPassword} onChange={(event) => setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:bg-white" />
              </label>
              <button type="submit" disabled={savingPassword} className="mt-5 w-full rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">
                {savingPassword ? "Updating password..." : "Update Password"}
              </button>
            </form>
          </div>
        )}

        {infoPanel && (
          <div className="fixed inset-0 z-50 flex items-end bg-slate-900/40 p-4 sm:items-center sm:justify-center">
            <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {infoPanel === "about" ? "About CampusTrip" : "Help & Support"}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {infoPanel === "about"
                      ? "CampusTrip v1.0.0 helps students plan trips, manage budgets, build shared checklists, and coordinate with their group."
                      : "Need help with your account or a trip? Contact the CampusTrip support team and include the email address on your profile."}
                  </p>
                </div>
                <button type="button" onClick={() => setInfoPanel("")} className="rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="Close">
                  <X size={18} />
                </button>
              </div>
              {infoPanel === "help" ? (
                <a href="mailto:support@campustrip.app?subject=CampusTrip%20Support" className="mt-5 flex w-full items-center justify-center rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white transition hover:bg-blue-700">
                  Email Support
                </a>
              ) : (
                <button type="button" onClick={() => setInfoPanel("")} className="mt-5 w-full rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white transition hover:bg-blue-700">
                  Close
                </button>
              )}
            </div>
          </div>
        )}

        {/* Single Visually Separated Logout Action at Bottom */}
        <div className="pt-2 md:hidden">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-3.5 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 active:scale-[0.99] text-red-600 font-semibold text-xs rounded-2xl border border-red-100 transition cursor-pointer"
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </div>

    </MobileShell>
  );
}
