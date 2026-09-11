import { NavLink, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  CheckSquare,
  History,
  Bell,
  Home,
  KeyRound,
  LogOut,
  Map,
  MessageSquare,
  Settings,
  Trash2,
  UserCircle,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  getNotifications,
  deleteNotification,
  markAllNotificationsRead,
} from "../../api/authApi";
import BrandLogo from "../common/BrandLogo";

function Sidebar() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const token = localStorage.getItem("campusTripToken");

        if (!token) return;

        const data = await getNotifications(token);

        setNotifications(data.notifications || []);
      } catch (error) {
        console.error("Unable to load notifications:", error);
      }
    };

    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const navItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      to: "/trips",
      label: "My Trips",
      icon: Map,
    },
    {
      to: "/trip-history",
      label: "Trip History",
      icon: History,
    },
    {
      to: "/join-trip",
      label: "Join Trip",
      icon: KeyRound,
    },
    {
      to: "/schedule",
      label: "Schedule",
      icon: CalendarDays,
    },
    {
      to: "/budget",
      label: "Budget",
      icon: Wallet,
    },
    {
      to: "/checklist",
      label: "Checklist",
      icon: CheckSquare,
    },
    {
      to: "/members",
      label: "Members",
      icon: Users,
    },
    {
      to: "/chat",
      label: "Group Chat",
      icon: MessageSquare,
    },
    {
      to: "/profile",
      label: "Profile",
      icon: UserCircle,
    },
    {
      to: "/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("campusTripToken");
    localStorage.removeItem("campusTripCurrentUser");

    setIsOpen(false);

    navigate("/login");
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const handleDeleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem("campusTripToken");
      if (!token) return;

      await deleteNotification(notificationId, token);
      setNotifications((current) =>
        current.filter((notification) => notification._id !== notificationId)
      );
    } catch (error) {
      console.error("Unable to delete notification:", error);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col overflow-y-auto border-r border-slate-100 bg-white p-5 shadow-xl transition-transform duration-300 md:static md:min-h-screen md:w-64 md:max-w-none md:translate-x-0 md:shadow-sm ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="mb-8 flex items-center justify-between">
          <NavLink to="/dashboard" className="transition-transform hover:scale-[1.02]">
            <BrandLogo size="sm" />
          </NavLink>

          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-gray-600 hover:bg-blue-50 md:hidden"
          >
            <X size={21} />
          </button>
        </div>

        {/* Notifications */}
        <div className="relative mb-4">
          <button
            type="button"
            onClick={() => {
              setShowNotifications((current) => !current);
            }}
            className="relative flex w-full items-center gap-3 rounded-xl p-3 text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
          >
            <Bell size={20} />

            <span>Notifications</span>

            {unreadCount > 0 && (
              <span className="ml-auto flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute left-0 top-full z-[100] mt-2 w-full rounded-2xl border bg-white p-3 shadow-xl">
              <div className="flex items-center justify-between px-2 py-2">
                <h3 className="font-bold text-slate-900">
                  Notifications
                </h3>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const token =
                          localStorage.getItem("campusTripToken");

                        if (!token) return;

                        await markAllNotificationsRead(token);

                        setNotifications((current) =>
                          current.map((notification) => ({
                            ...notification,
                            read: true,
                          }))
                        );
                      } catch (error) {
                        console.error(error);
                      }
                    }}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <p className="px-2 py-4 text-center text-sm text-gray-500">
                  No notifications yet.
                </p>
              ) : (
                <div className="max-h-72 space-y-2 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`relative rounded-xl p-3 pr-10 ${
                        notification.read
                          ? "bg-gray-50"
                          : "bg-blue-50"
                      }`}
                    >
                      <p className="text-sm font-semibold text-gray-800">
                        {notification.title}
                      </p>

                      <p className="mt-1 text-xs text-gray-600">
                        {notification.message}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteNotification(notification._id)
                        }
                        className="absolute right-2 top-2 rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                        aria-label={`Delete notification: ${notification.title}`}
                      >
                        <Trash2 size={15} />
                      </button>

                      {!notification.read && (
                        <span className="mt-2 inline-block text-xs font-semibold text-blue-600">
                          New
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Home Button - Desktop Only */}
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            navigate("/");
          }}
          className="mb-6 hidden items-center gap-3 rounded-xl bg-blue-50 p-3 font-semibold text-blue-700 transition hover:bg-blue-100 md:flex"
        >
          <Home size={20} />
          Home
        </button>

        {/* Navigation */}
        <nav className="flex-1 space-y-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              replace={["/dashboard", "/trips", "/chat", "/profile"].includes(to)}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl p-3 transition ${
                  isActive
                    ? "bg-blue-50 font-semibold text-blue-700"
                    : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 flex items-center gap-3 rounded-xl bg-red-50 p-3 font-semibold text-red-600 transition hover:bg-red-100"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>
    </>
  );
}

export default Sidebar;
