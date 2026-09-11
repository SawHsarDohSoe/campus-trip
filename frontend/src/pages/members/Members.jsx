import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Menu,
  ChevronDown,
  UserPlus,
  Crown,
  Copy,
  Check,
  X,
  Trash2,
  Users,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import MobileShell from "../../components/layout/MobileShell";
import {
  getTrips,
  getMembers,
  createMember,
  deleteMember,
} from "../../api/authApi";

export default function Members() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState("");
  const [members, setMembers] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrips = async () => {
      const token = localStorage.getItem("campusTripToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const data = await getTrips(token);
        if (data?.trips?.length) {
          setTrips(data.trips);
          setSelectedTripId(data.trips[0]._id);
        }
      } catch (err) {
        console.error("Error loading trips:", err);
      } finally {
        setLoading(false);
      }
    };
    loadTrips();
  }, [navigate]);

  const fetchMembers = async () => {
    const token = localStorage.getItem("campusTripToken");
    if (!token || !selectedTripId) return;

    try {
      const data = await getMembers(token, selectedTripId);
      if (data?.members) {
        setMembers(data.members);
      }
    } catch (err) {
      console.error("Failed to load members:", err);
    }
  };

  useEffect(() => {
    if (!selectedTripId) {
      setMembers([]);
      return;
    }
    fetchMembers();
  }, [selectedTripId]);

  const activeTrip = trips.find((t) => t._id === selectedTripId);
  const joinCode = activeTrip?.joinCode || "";

  const handleCopyCode = () => {
    if (!joinCode) return;
    navigator.clipboard?.writeText(joinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!inviteName.trim() || !selectedTripId) return;

    const token = localStorage.getItem("campusTripToken");
    if (!token) return;

    try {
      await createMember(
        {
          tripId: selectedTripId,
          name: inviteName.trim(),
          email: inviteEmail.trim() || `${inviteName.toLowerCase().replace(/\s+/g, "")}@example.com`,
        },
        token
      );
      setInviteName("");
      setInviteEmail("");
      setShowInviteModal(false);
      await fetchMembers();
    } catch (err) {
      alert(err.message || "Failed to add member.");
    }
  };

  const handleDeleteMember = async (id) => {
    const token = localStorage.getItem("campusTripToken");
    if (!token) return;

    try {
      await deleteMember(id, token);
      setMembers((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      alert(err.message || "Failed to remove member.");
    }
  };

  const avatarColors = [
    "bg-blue-600 text-white",
    "bg-emerald-500 text-white",
    "bg-amber-500 text-white",
    "bg-purple-500 text-white",
    "bg-rose-500 text-white",
  ];

  return (
    <MobileShell showBottomNav={true} contentClassName="bg-slate-50/50">
      {/* Top Header */}
      <div className="bg-white px-4 sm:px-6 pt-3 pb-3 flex items-center justify-between border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-700 transition cursor-pointer"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft size={19} />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Members</h1>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 space-y-4">
        {/* Trip Switcher Dropdown */}
        {trips.length > 0 ? (
          <div className="relative">
            <select
              value={selectedTripId}
              onChange={(e) => setSelectedTripId(e.target.value)}
              className="w-full bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-xl py-2.5 px-3.5 appearance-none focus:outline-none focus:border-blue-600 shadow-sm"
            >
              {trips.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.title}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        ) : (
          <div className="p-6 bg-white rounded-2xl border border-slate-100 text-center">
            <Users size={28} className="mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-700">No Trips Created</p>
            <p className="text-[11px] text-slate-400 mt-1">Create a trip to collaborate with members.</p>
            <Link
              to="/trips/create"
              className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
            >
              Create Trip
            </Link>
          </div>
        )}

        {/* Invite Members Full-Width Button */}
        {selectedTripId && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-[0.99] transition"
          >
            <UserPlus size={16} />
            <span>+ Invite Members</span>
          </button>
        )}

        {/* Members List */}
        {selectedTripId && (
          <div className="space-y-2.5 pt-1">
            {members.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-400">No members added to this trip yet.</p>
              </div>
            ) : (
              members.map((member, idx) => (
                <div
                  key={member._id}
                  className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shadow-sm shrink-0 ${
                        avatarColors[idx % avatarColors.length]
                      }`}
                    >
                      {(member.name || "U")[0].toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h2 className="text-xs font-bold text-slate-900">
                          {member.name}
                        </h2>
                        {member.role === "Trip Creator" || idx === 0 ? (
                          <Crown
                            size={14}
                            className="text-amber-500 fill-amber-500 shrink-0"
                          />
                        ) : null}
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {member.role || "Member"}
                      </span>
                    </div>
                  </div>

                  {idx !== 0 && (
                    <button
                      onClick={() => handleDeleteMember(member._id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition p-1.5"
                      aria-label="Remove member"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Invite Modal with Join Code & QR */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 animate-in fade-in zoom-in-95 flex flex-col items-center text-center">
            <div className="w-full flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Invite Members</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X size={16} />
              </button>
            </div>

            {/* 6 Digit Join Code Display */}
            {joinCode && (
              <div className="mt-4 w-full">
                <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                  Trip Join Code
                </span>
                <div className="flex items-center justify-center gap-2 mt-2 bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4">
                  <span className="text-2xl font-mono font-extrabold tracking-widest text-blue-600">
                    {joinCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="ml-3 p-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                    title="Copy code"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            )}

            {/* QR Code */}
            {joinCode && (
              <div className="my-4 p-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
                <QRCodeSVG
                  value={`https://campustrip.app/join?code=${joinCode}`}
                  size={130}
                />
              </div>
            )}

            {/* Direct Add form */}
            <form onSubmit={handleAddMember} className="w-full space-y-2.5 mt-1 text-left">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                Or add member directly
              </span>
              <input
                type="text"
                required
                placeholder="Full Name (e.g. Alex Tan)"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
              <input
                type="email"
                placeholder="Email address (optional)"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition"
              >
                Add Member
              </button>
            </form>
          </div>
        </div>
      )}
    </MobileShell>
  );
}
