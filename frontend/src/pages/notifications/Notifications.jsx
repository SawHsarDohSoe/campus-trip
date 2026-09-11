import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  UserPlus,
  Calendar,
  Wallet,
  MessageSquare,
  ChevronRight,
  CheckCheck,
  Bell,
} from "lucide-react";
import MobileShell from "../../components/layout/MobileShell";
import MobileHeader from "../../components/layout/MobileHeader";
import { getNotifications, markAllNotificationsRead } from "../../api/authApi";

export default function Notifications() {
  const navigate = useNavigate();
  const location = useLocation();
  const [filter, setFilter] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    const token = localStorage.getItem("campusTripToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const data = await getNotifications(token);
      if (data?.notifications) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, [navigate]);

  const handleMarkAllRead = async () => {
    const token = localStorage.getItem("campusTripToken");
    if (!token) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await markAllNotificationsRead(token);
    } catch (err) {
      console.error("Error marking all read:", err);
    }
  };

  const getCategoryIcon = (type = "") => {
    const t = type.toLowerCase();
    if (t.includes("member")) {
      return {
        icon: <UserPlus size={18} className="text-emerald-600" />,
        bg: "bg-emerald-50",
      };
    }
    if (t.includes("trip") || t.includes("schedule")) {
      return {
        icon: <Calendar size={18} className="text-blue-600" />,
        bg: "bg-blue-50",
      };
    }
    if (t.includes("budget") || t.includes("expense")) {
      return {
        icon: <Wallet size={18} className="text-amber-600" />,
        bg: "bg-amber-50",
      };
    }
    return {
      icon: <MessageSquare size={18} className="text-purple-600" />,
      bg: "bg-purple-50",
    };
  };

  const filtered = notifications.filter((item) => {
    if (filter === "All") return true;
    if (filter === "Trip") return item.type === "Trip" || item.type === "trip";
    if (filter === "System") return item.type !== "Trip" && item.type !== "trip";
    return true;
  });

  return (
    <MobileShell showBottomNav={true} contentClassName="bg-slate-50/50">
      <MobileHeader
        title="Notifications"
        showBack
        backTo={location.state?.from || "/dashboard"}
        rightAction={notifications.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            title="Mark all as read"
            className="text-slate-400 hover:text-blue-600 transition p-1.5"
          >
            <CheckCheck size={18} />
          </button>
        )}
      />

      {/* Filter Tabs */}
      <div className="px-5 pt-4 pb-2 flex items-center gap-2">
        {["All", "Trip", "System"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === tab
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="px-5 py-3 space-y-2.5">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 px-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-2">
              <Bell size={22} />
            </div>
            <p className="text-xs font-bold text-slate-700">No Notifications</p>
            <p className="text-[11px] text-slate-400 mt-1">
              You are all caught up! New trip updates will appear here.
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const { icon, bg } = getCategoryIcon(item.type);
            const isUnread = !item.read;
            return (
              <div
                key={item._id}
                className={`p-3.5 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3.5 transition hover:shadow-md ${
                  isUnread ? "border-l-4 border-l-blue-600" : ""
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${bg}`}
                >
                  {icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold text-slate-900 truncate">
                      {item.title}
                    </h2>
                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {item.message}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {new Date(item.createdAt || Date.now()).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <ChevronRight size={15} className="text-slate-300 shrink-0" />
              </div>
            );
          })
        )}
      </div>
    </MobileShell>
  );
}
