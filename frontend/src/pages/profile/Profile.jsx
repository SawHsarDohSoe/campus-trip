import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Bell,
  Info,
  HelpCircle,
  ChevronRight,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react";
import MobileShell from "../../components/layout/MobileShell";
import MobileHeader from "../../components/layout/MobileHeader";
import { getCurrentUser, getSettings, updateSettings } from "../../api/authApi";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [, setLoading] = useState(true);

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
    setNotificationsEnabled(nextState);

    if (token) {
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
      } catch (err) {
        console.error("Failed to update notification settings:", err);
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      localStorage.removeItem("campusTripToken");
      localStorage.removeItem("campusTripCurrentUser");
      navigate("/login");
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

          {/* Change Password */}
          <button
            type="button"
            onClick={() => alert("Password reset instructions sent to your email address.")}
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
            onClick={() =>
              alert("CampusTrip v1.0.0\nPlan smarter. Travel together.\nStudent trip planning made simple.")
            }
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
            onClick={() =>
              alert("For support or inquiries, contact:\nsupport@campustrip.app")
            }
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
