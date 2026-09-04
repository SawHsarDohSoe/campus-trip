import { NavLink, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  CheckSquare,
  Compass,
  History,
  Bell,
  Home,
  KeyRound,
  LogOut,
  Map,
  Menu,
  Settings,
  Trash2,
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
      {/* Mobile Menu Button */}
      <button
        type="button"
        aria-label="Open navigation menu"
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-xl bg-white p-3 text-[#1E3A8A] shadow-lg md:hidden"
      >
        <Menu size={22} />
      </button>

      {/* One-tap, logo-only Home control for every mobile app page. */}
      <NavLink
        to="/dashboard"
        replace
        aria-label="CampusTrip dashboard"
        className="fixed left-20 top-4 z-40 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#1E3A8A] shadow-sm ring-1 ring-blue-100 transition hover:bg-blue-100 md:hidden"
      >
        <Compass size={22} />
      </NavLink>

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
       className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col overflow-y-auto bg-white p-5 shadow-xl transition-transform duration-300 md:static md:min-h-screen md:w-64 md:max-w-none md:translate-x-0 md:shadow-sm ${
        isOpen ? "translate-x-0" : "-translate-x-full"
}`} >
        {/* Logo */}
        <div className="mb-8 flex items-center justify-between">
          <NavLink to="/dashboard" className="flex items-center gap-2 text-2xl font-bold text-[#1E3A8A]">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1E3A8A] text-white">
              <Compass size={21} />
            </span>
            CampusTrip
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
            className="relative flex w-full items-center gap-3 rounded-xl p-3 text-gray-700 transition hover:bg-blue-50 hover:text-[#1E3A8A]"
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
                <h3 className="font-bold text-[#1E3A8A]">
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
          className="mb-6 hidden items-center gap-3 rounded-xl bg-blue-50 p-3 font-semibold text-[#1E3A8A] transition hover:bg-blue-100 md:flex"
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
              replace
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl p-3 transition ${
                  isActive
                    ? "bg-blue-50 font-semibold text-[#1E3A8A]"
                    : "text-gray-700 hover:bg-blue-50 hover:text-[#1E3A8A]"
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
