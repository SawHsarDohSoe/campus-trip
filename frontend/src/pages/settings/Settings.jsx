import { useEffect, useState } from "react";
import {
  Bell,
  LockKeyhole,
  Save,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import {
  getSettings,
  updateSettings,
} from "../../api/authApi";

const defaultProfile = {
  name: "",
  email: "",
  university: "",
};

const defaultNotifications = {
  tripUpdates: true,
  budgetAlerts: true,
  memberInvitations: true,
};

function Settings() {
  const navigate = useNavigate();

  const [profile, setProfile] =
    useState(defaultProfile);

  const [notifications, setNotifications] =
    useState(defaultNotifications);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const token =
          localStorage.getItem("campusTripToken");

        if (!token) {
          navigate("/login");
          return;
        }

        const data = await getSettings(token);

        setProfile(
          data.profile ?? defaultProfile
        );

        setNotifications(
          data.notifications ?? defaultNotifications
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [navigate]);

  const handleProfileChange = (event) => {
    setProfile({
      ...profile,
      [event.target.name]: event.target.value,
    });

    setIsSaved(false);
  };

  const handleNotificationChange = (event) => {
    setNotifications({
      ...notifications,
      [event.target.name]: event.target.checked,
    });

    setIsSaved(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setIsSaved(false);
      setError("");

      const token =
        localStorage.getItem("campusTripToken");

      const data = await updateSettings(
        {
          profile,
          notifications,
        },
        token
      );

      setProfile(data.profile);
      setNotifications(data.notifications);

      setIsSaved(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />

        <main className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">
            Loading settings...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex flex-1 flex-col gap-8 p-6 pt-20 md:p-8">

        {/* Header */}
        <div>
          <p className="text-sm font-semibold text-blue-700">
            CampusTrip Account
          </p>

          <h1 className="mt-1 text-3xl font-bold text-[#1E3A8A] md:text-4xl">
            Settings
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your profile and notification preferences.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex max-w-4xl flex-col gap-8"
        >

          {/* Profile */}
          <section className="rounded-3xl bg-white p-6 shadow-lg md:p-8">

            <div className="flex items-center gap-3">

              <div className="rounded-2xl bg-[#E5F6FD] p-3 text-[#1E3A8A]">
                <UserRound size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#1E3A8A]">
                  Profile information
                </h2>

                <p className="mt-1 text-gray-500">
                  Update the information shown to your trip members.
                </p>
              </div>

            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Full name
                </label>

                <input
                  required
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Email address
                </label>

                <input
                  required
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block font-medium text-gray-700">
                  University
                </label>

                <input
                  name="university"
                  value={profile.university}
                  onChange={handleProfileChange}
                  placeholder="e.g. Kasem Bundit University"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#1E3A8A]"
                />
              </div>

            </div>

          </section>

          {/* Notifications */}
          <section className="rounded-3xl bg-white p-6 shadow-lg md:p-8">

            <div className="flex items-center gap-3">

              <div className="rounded-2xl bg-[#FFF9EF] p-3 text-[#1E3A8A]">
                <Bell size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#1E3A8A]">
                  Notifications
                </h2>

                <p className="mt-1 text-gray-500">
                  Choose which CampusTrip updates you want to receive.
                </p>
              </div>

            </div>

            <div className="mt-7 space-y-5">

              <label className="flex cursor-pointer items-center justify-between gap-4">

                <div>
                  <p className="font-semibold text-gray-800">
                    Trip updates
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Receive updates when trip details change.
                  </p>
                </div>

                <input
                  name="tripUpdates"
                  type="checkbox"
                  checked={notifications.tripUpdates}
                  onChange={handleNotificationChange}
                  className="h-5 w-5 accent-[#1E3A8A]"
                />

              </label>

              <label className="flex cursor-pointer items-center justify-between gap-4">

                <div>
                  <p className="font-semibold text-gray-800">
                    Budget alerts
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Be notified when spending reaches the budget limit.
                  </p>
                </div>

                <input
                  name="budgetAlerts"
                  type="checkbox"
                  checked={notifications.budgetAlerts}
                  onChange={handleNotificationChange}
                  className="h-5 w-5 accent-[#1E3A8A]"
                />

              </label>

              <label className="flex cursor-pointer items-center justify-between gap-4">

                <div>
                  <p className="font-semibold text-gray-800">
                    Member invitations
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Receive notifications when students join a trip.
                  </p>
                </div>

                <input
                  name="memberInvitations"
                  type="checkbox"
                  checked={
                    notifications.memberInvitations
                  }
                  onChange={handleNotificationChange}
                  className="h-5 w-5 accent-[#1E3A8A]"
                />

              </label>

            </div>

          </section>

          {/* Security */}
          <section className="rounded-3xl bg-white p-6 shadow-lg md:p-8">

            <div className="flex items-center gap-3">

              <div className="rounded-2xl bg-red-50 p-3 text-red-600">
                <LockKeyhole size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#1E3A8A]">
                  Account security
                </h2>

                <p className="mt-1 text-gray-500">
                  Password changes will be connected after authentication is built.
                </p>
              </div>

            </div>

            <button
              type="button"
              disabled
              className="mt-6 cursor-not-allowed rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-400"
            >
              Change password
            </button>

          </section>

          {/* Save */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={19} />

              {saving
                ? "Saving..."
                : "Save changes"}
            </button>

            {isSaved && (
              <p className="text-sm font-medium text-green-600">
                Settings saved successfully.
              </p>
            )}

          </div>

        </form>

      </main>
    </div>
  );
}

export default Settings;