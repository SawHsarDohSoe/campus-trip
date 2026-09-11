import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Lock,
  Bell,
  Info,
  HelpCircle,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react";
import MobileShell from "../../components/layout/MobileShell";
import { getCurrentUser, getSettings, updateSettings } from "../../api/authApi";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("campusTripToken");
      const storedUser = localStorage.getItem("campusTripCurrentUser");

      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          setUser(u);
          setEditName(u.name || "");
          setEditEmail(u.email || "");
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
          setEditName(u.name || "");
          setEditEmail(u.email || "");
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

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("campusTripToken");
    if (!token) return;

    try {
      setSaving(true);
      const res = await updateSettings(
        {
          profile: {
            name: editName,
            email: editEmail,
          },
        },
        token
      );

      const updated = {
        ...user,
        name: res.profile?.name || editName,
        email: res.profile?.email || editEmail,
      };
      setUser(updated);
      localStorage.setItem("campusTripCurrentUser", JSON.stringify(updated));
      setEditModal(false);
    } catch (err) {
      alert(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
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
    <MobileShell showBottomNav={true} contentClassName="bg-slate-50/50">
      {/* Top Header */}
      <div className="bg-white px-5 pt-3 pb-3 flex items-center gap-3 border-b border-slate-100 sticky top-0 z-20">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-700 transition"
          aria-label="Back"
        >
          <ArrowLeft size={19} />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Profile</h1>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* User Card */}
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-blue-600 text-white font-bold text-3xl flex items-center justify-center shadow-lg shadow-blue-500/25 mb-3">
            {initialLetter}
          </div>

          <h2 className="text-lg font-bold text-slate-900">{user?.name || "Student User"}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{user?.email || "user@example.com"}</p>
        </div>

        {/* Menu Options Group */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {/* Edit Profile */}
          <button
            onClick={() => setEditModal(true)}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <User size={16} />
              </div>
              <span className="text-xs font-semibold text-slate-800">Edit Profile</span>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </button>

          {/* Change Password */}
          <button
            onClick={() => alert("Password reset link sent to your email address.")}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Lock size={16} />
              </div>
              <span className="text-xs font-semibold text-slate-800">Change Password</span>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </button>

          {/* Notifications Toggle */}
          <div className="px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Bell size={16} />
              </div>
              <span className="text-xs font-semibold text-slate-800">Notifications</span>
            </div>
            <button
              onClick={handleToggleNotifications}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                notificationsEnabled ? "bg-blue-600" : "bg-slate-300"
              }`}
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
            onClick={() =>
              alert("CampusTrip v1.0.0\nPlan smarter. Travel together.\nProduction mobile application.")
            }
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Info size={16} />
              </div>
              <span className="text-xs font-semibold text-slate-800">About</span>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </button>

          {/* Help & Support */}
          <button
            onClick={() =>
              alert("For help or bug reports, contact: support@campustrip.app")
            }
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <HelpCircle size={16} />
              </div>
              <span className="text-xs font-semibold text-slate-800">Help & Support</span>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-3.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs rounded-2xl flex items-center justify-center gap-2 transition active:scale-98"
        >
          <LogOut size={16} />
          <span>Log Out</span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Edit Profile</h3>
              <button
                onClick={() => setEditModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MobileShell>
  );
}
