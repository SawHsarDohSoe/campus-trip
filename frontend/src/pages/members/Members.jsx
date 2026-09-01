import { useEffect, useState } from "react";
import {
  Mail,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import {
  createMember,
  deleteMember,
  getMembers,
  getTrips,
  updateMember,
} from "../../api/authApi";

function Members() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [members, setMembers] = useState([]);
  const [tripId, setTripId] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [formData, setFormData] = useState({
  name: "",
  email: "",
});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectedTrip = trips.find(
    (trip) => trip._id === tripId
  );

  const maxMembers = selectedTrip?.members ?? 0;

  const confirmedCount = members.filter(
    (member) => member.status === "Confirmed"
  ).length;

  const pendingCount = members.filter(
    (member) => member.status === "Pending"
  ).length;

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const token =
          localStorage.getItem("campusTripToken");

        if (!token) {
          navigate("/login");
          return;
        }

        const tripsData = await getTrips(token);

        setTrips(tripsData.trips);

        if (tripsData.trips.length > 0) {
          const firstTrip = tripsData.trips[0];

          setTripId(firstTrip._id);

          const membersData = await getMembers(
            token,
            firstTrip._id
          );

          setMembers(membersData.members);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, [navigate]);

  const handleTripChange = async (event) => {
    const selectedTripId = event.target.value;

    setTripId(selectedTripId);

    try {
      const token =
        localStorage.getItem("campusTripToken");

      const data = await getMembers(
        token,
        selectedTripId
      );

      setMembers(data.members);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !tripId
    ) {
      return;
    }

    if (members.length >= maxMembers) {
      setError("This trip has reached its maximum capacity.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const token =
        localStorage.getItem("campusTripToken");

      const data = await createMember(
  {
    tripId,
    name: formData.name.trim(),
    email: formData.email.trim(),
    role: "Member",
  },
  token
);

      setMembers((current) => [
        ...current,
        data.member,
      ]);

      ssetFormData({
  name: "",
  email: "",
});

      setIsFormOpen(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirm = async (member) => {
    try {
      const token =
        localStorage.getItem("campusTripToken");

      const data = await updateMember(
        member._id,
        { status: "Confirmed" },
        token
      );

      setMembers((current) =>
        current.map((item) =>
          item._id === member._id
            ? data.member
            : item
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (memberId) => {
    const confirmed = window.confirm(
      "Remove this member from the trip?"
    );

    if (!confirmed) return;

    try {
      const token =
        localStorage.getItem("campusTripToken");

      await deleteMember(memberId, token);

      setMembers((current) =>
        current.filter(
          (member) => member._id !== memberId
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />

        <main className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">
            Loading members...
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
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

          <div>
            <p className="text-sm font-semibold text-blue-700">
              {selectedTrip?.title || "CampusTrip"}
            </p>

            <h1 className="mt-1 text-3xl font-bold text-[#1E3A8A] md:text-4xl">
              Trip Members
            </h1>

            <p className="mt-2 text-gray-500">
              Manage the students joining this campus trip.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            disabled={
              !tripId || members.length >= maxMembers
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={20} />
            Invite Member
          </button>

        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
            {error}
          </div>
        )}

        {/* Trip Selector */}
        {trips.length > 0 && (
          <section className="rounded-3xl bg-white p-6 shadow-lg">

            <label className="mb-2 block font-medium text-gray-700">
              Select Trip
            </label>

            <select
              value={tripId}
              onChange={handleTripChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#1E3A8A] md:max-w-lg"
            >
              {trips.map((trip) => (
                <option
                  key={trip._id}
                  value={trip._id}
                >
                  {trip.title} — {trip.destination}
                </option>
              ))}
            </select>

          </section>
        )}

        {/* Summary */}
        <section className="mobile-summary-grid grid grid-cols-2 gap-6 lg:grid-cols-3">

          <div className="rounded-3xl bg-[#E5F6FD] p-7 shadow-lg lg:col-span-2">

            <div className="flex items-center justify-between">

              <div>
                <p className="font-medium text-gray-600">
                  Total members
                </p>

               <p className="mt-2 text-4xl font-bold text-[#1E3A8A]">
  {members.length} / {maxMembers}
</p>
              </div>

              <Users
                className="text-[#1E3A8A]"
                size={42}
              />

            </div>

            <p className="mt-5 text-sm text-gray-600">
  {confirmedCount} confirmed
  {pendingCount > 0 && ` • ${pendingCount} pending`}
</p>

          </div>

          <div className="rounded-3xl bg-white p-7 shadow-lg">

            <p className="text-sm font-medium text-gray-500">
              Maximum capacity
            </p>

            <p className="mt-2 text-4xl font-bold text-[#1E3A8A]">
              {maxMembers}
            </p>

            <p className="mt-3 text-sm text-gray-500">
              {Math.max(
                maxMembers - members.length,
                0
              )}{" "}
              spaces still available.
            </p>

          </div>

        </section>

        {/* Member list */}
        <section className="rounded-3xl bg-white p-6 shadow-lg md:p-8">

          <div className="flex items-center gap-3">

            <Users
              className="text-[#1E3A8A]"
              size={28}
            />

            <div>
              <h2 className="text-2xl font-bold text-[#1E3A8A]">
                Member list
              </h2>

              <p className="mt-1 text-gray-500">
                Members are stored in your CampusTrip account.
              </p>
            </div>

          </div>

          <div className="mt-6 divide-y divide-gray-100">

            {members.length > 0 ? (
              members.map((member) => (
                <div
                  key={member._id}
                  className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5F6FD] font-bold text-[#1E3A8A]">
                      {member.name.charAt(0).toUpperCase()}
                    </div>

                    <div>

                      <h3 className="font-semibold text-gray-800">
                        {member.name}
                      </h3>

                      <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                        <Mail size={15} />
                        {member.email}
                      </p>

                    </div>

                  </div>

                  <div className="flex flex-wrap items-center gap-3">

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                      {member.role}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleConfirm(member)
                      }
                      disabled={
                        member.status === "Confirmed"
                      }
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        member.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700 hover:bg-green-100 hover:text-green-700"
                      }`}
                    >
                      {member.status}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(member._id)
                      }
                      className="rounded-xl border border-red-200 p-2 text-red-600 hover:bg-red-50"
                      aria-label={`Remove ${member.name}`}
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>

                </div>
              ))
            ) : (
              <div className="py-10 text-center">

                <Users
                  className="mx-auto text-gray-300"
                  size={40}
                />

                <p className="mt-4 font-semibold text-gray-800">
                  No members yet
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Invite students to join this trip.
                </p>

              </div>
            )}

          </div>

        </section>

      </main>

      {/* Invite Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"
          >

            <h2 className="text-2xl font-bold text-[#1E3A8A]">
              Invite a member
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              The invitation will be saved to this trip.
            </p>

            <div className="mt-6 space-y-4">

              <input
                required
                value={formData.name}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    name: event.target.value,
                  })
                }
                placeholder="Student name"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#1E3A8A]"
              />

              <input
                required
                type="email"
                value={formData.email}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    email: event.target.value,
                  })
                }
                placeholder="Student email"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#1E3A8A]"
              />

              <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-[#1E3A8A]">
  New invitations will be added as <strong>Members</strong>.
</div>

            </div>

            <div className="mt-7 flex justify-end gap-3">

              <button
                type="button"
                onClick={() =>
                  setIsFormOpen(false)
                }
                className="rounded-xl border border-gray-300 px-5 py-3 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#1E3A8A] px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Sending..."
                  : "Send invitation"}
              </button>

            </div>

          </form>

        </div>
      )}

    </div>
  );
}

export default Members;
