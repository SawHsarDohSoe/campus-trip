import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  Bus,
  CalendarDays,
  Clock,
  MapPin,
  Pencil,
  Plus,
  Send,
  Trash2,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import {
  createSchedule,
  deleteSchedule,
  deleteTrip,
  getSchedules,
  getTrip,
  getWeather,
  getPolls,
  createPoll,
  votePoll,
  closePoll,
  getDiscussionMessages,
  createDiscussionMessage,
  deleteDiscussionMessage,
} from "../../api/authApi";

const currency = new Intl.NumberFormat("en-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
});

function formatDate(startDate, endDate) {
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const start = new Date(startDate).toLocaleDateString(
    "en-GB",
    options
  );

  const end = new Date(endDate).toLocaleDateString(
    "en-GB",
    options
  );

  return `${start} – ${end}`;
}

function formatScheduleDate(date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
const [schedules, setSchedules] = useState([]);
const [polls, setPolls] = useState([]);
const [messages, setMessages] = useState([]);
const [discussionLoading, setDiscussionLoading] = useState(true);
const [discussionError, setDiscussionError] = useState("");
const [newMessage, setNewMessage] = useState("");
const [sendingMessage, setSendingMessage] = useState(false);

const [pollLoading, setPollLoading] = useState(true);
const [pollError, setPollError] = useState("");
const [isPollFormOpen, setIsPollFormOpen] = useState(false);
const [savingPoll, setSavingPoll] = useState(false);

const [pollForm, setPollForm] = useState({
  question: "",
  options: ["", ""],
});

  const [loading, setLoading] = useState(true);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [savingSchedule, setSavingSchedule] = useState(false);

  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState("");

  const [error, setError] = useState("");
  const [scheduleError, setScheduleError] = useState("");
const [copied, setCopied] = useState(false);

  const [isScheduleFormOpen, setIsScheduleFormOpen] =
    useState(false);

  const [scheduleForm, setScheduleForm] = useState({
    date: "",
    time: "",
    activity: "",
    location: "",
    notes: "",
  });

  useEffect(() => {
    const loadTrip = async () => {
      try {
        const token = localStorage.getItem("campusTripToken");

        if (!token) {
          navigate("/login");
          return;
        }

       const [
  tripData,
  scheduleData,
  pollData,
  discussionData,
] = await Promise.all([
  getTrip(id, token),
  getSchedules(id, token),
  getPolls(id, token),
  getDiscussionMessages(id, token),
]);

setTrip(tripData.trip);
setSchedules(scheduleData.schedules);
setPolls(pollData.polls || []);
setMessages(discussionData.messages || []);

try {
  const weatherData = await getWeather(
    tripData.trip.destination,
    token
  );

  setWeather(weatherData);
} catch (error) {
  setWeatherError(error.message);
} finally {
  setWeatherLoading(false);
}
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
        setScheduleLoading(false);
        setDiscussionLoading(false);
        setPollLoading(false);
      }
    };

    loadTrip();
  }, [id, navigate]);

useEffect(() => {
  const refreshDiscussion = async () => {
    try {
      const token = localStorage.getItem("campusTripToken");

      if (!token || !id) {
        return;
      }

      const data = await getDiscussionMessages(id, token);

      setMessages(data.messages || []);
    } catch (error) {
      console.error("Unable to refresh discussion:", error);
    }
  };

  const interval = setInterval(
    refreshDiscussion,
    5000
  );

  return () => {
    clearInterval(interval);
  };
}, [id]);

  const handleScheduleChange = (event) => {
    setScheduleForm({
      ...scheduleForm,
      [event.target.name]: event.target.value,
    });

    setScheduleError("");
  };

  const handleCreateSchedule = async (event) => {
    event.preventDefault();

    setScheduleError("");
    setSavingSchedule(true);

    try {
      const token = localStorage.getItem("campusTripToken");

      if (!token) {
        navigate("/login");
        return;
      }

      const data = await createSchedule(
        id,
        scheduleForm,
        token
      );

      setSchedules((current) => [
        ...current,
        data.schedule,
      ].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        if (dateA - dateB !== 0) {
          return dateA - dateB;
        }

        return a.time.localeCompare(b.time);
      }));

      setScheduleForm({
        date: "",
        time: "",
        activity: "",
        location: "",
        notes: "",
      });

      setIsScheduleFormOpen(false);
    } catch (error) {
      setScheduleError(error.message);
    } finally {
      setSavingSchedule(false);
    }
  };
const handlePollOptionChange = (index, value) => {
  setPollForm((current) => {
    const options = [...current.options];
    options[index] = value;

    return {
      ...current,
      options,
    };
  });

  setPollError("");
};

const addPollOption = () => {
  if (pollForm.options.length >= 6) return;

  setPollForm((current) => ({
    ...current,
    options: [...current.options, ""],
  }));
};

const removePollOption = (index) => {
  if (pollForm.options.length <= 2) return;

  setPollForm((current) => ({
    ...current,
    options: current.options.filter(
      (_, optionIndex) => optionIndex !== index
    ),
  }));
};

const handleCreatePoll = async (event) => {
  event.preventDefault();

  setPollError("");

  const question = pollForm.question.trim();

  const options = pollForm.options
    .map((option) => option.trim())
    .filter(Boolean);

  if (!question) {
    setPollError("Please enter a poll question.");
    return;
  }

  if (options.length < 2) {
    setPollError("Please provide at least 2 options.");
    return;
  }

  try {
    setSavingPoll(true);

    const token = localStorage.getItem("campusTripToken");

    if (!token) {
      navigate("/login");
      return;
    }

    const data = await createPoll(
      id,
      {
        question,
        options,
      },
      token
    );

    setPolls((current) => [
      data.poll,
      ...current,
    ]);

    setPollForm({
      question: "",
      options: ["", ""],
    });

    setIsPollFormOpen(false);
  } catch (error) {
    setPollError(error.message);
  } finally {
    setSavingPoll(false);
  }
};

const handleVote = async (pollId, optionId) => {
  try {
    setPollError("");

    const token = localStorage.getItem("campusTripToken");

    if (!token) {
      navigate("/login");
      return;
    }

    const data = await votePoll(
      id,
      pollId,
      optionId,
      token
    );

    setPolls((current) =>
      current.map((poll) =>
        poll._id === pollId
          ? data.poll
          : poll
      )
    );
  } catch (error) {
    setPollError(error.message);
  }
};

const handleClosePoll = async (pollId) => {
  const confirmed = window.confirm(
    "Close this poll? Members will no longer be able to vote."
  );

  if (!confirmed) return;

  try {
    setPollError("");

    const token = localStorage.getItem("campusTripToken");

    if (!token) {
      navigate("/login");
      return;
    }

    const data = await closePoll(
      id,
      pollId,
      token
    );

    setPolls((current) =>
      current.map((poll) =>
        poll._id === pollId
          ? data.poll
          : poll
      )
    );
  } catch (error) {
    setPollError(error.message);
  }
};

const handleSendMessage = async (event) => {
  event.preventDefault();

  const message = newMessage.trim();

  if (!message) {
    return;
  }

  try {
    setSendingMessage(true);
    setDiscussionError("");

    const token = localStorage.getItem("campusTripToken");

    if (!token) {
      navigate("/login");
      return;
    }

    const data = await createDiscussionMessage(
      id,
      message,
      token
    );

    setMessages((current) => [
      ...current,
      data.message,
    ]);

    setNewMessage("");
  } catch (error) {
    setDiscussionError(error.message);
  } finally {
    setSendingMessage(false);
  }
};

const handleDeleteMessage = async (messageId) => {
  try {
    setDiscussionError("");

    const token = localStorage.getItem("campusTripToken");

    if (!token) {
      navigate("/login");
      return;
    }

    await deleteDiscussionMessage(
      id,
      messageId,
      token
    );

    setMessages((current) =>
      current.filter(
        (message) => message._id !== messageId
      )
    );
  } catch (error) {
    setDiscussionError(error.message);
  }
};

  const handleDeleteSchedule = async (scheduleId) => {
    const confirmed = window.confirm(
      "Delete this schedule item?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("campusTripToken");

      if (!token) {
        navigate("/login");
        return;
      }

      await deleteSchedule(id, scheduleId, token);

      setSchedules((current) =>
        current.filter(
          (schedule) => schedule._id !== scheduleId
        )
      );
    } catch (error) {
      setScheduleError(error.message);
    }
  };

  const handleDeleteTrip = async () => {
    const confirmed = window.confirm(
      `Delete "${trip.title}"?`
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("campusTripToken");

      if (!token) {
        navigate("/login");
        return;
      }

      await deleteTrip(trip._id, token);

      navigate("/trips");
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />

        <main className="flex flex-1 items-center justify-center p-8">
          <p className="text-gray-500">
            Loading trip...
          </p>
        </main>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />

        <main className="flex flex-1 flex-col items-center justify-center p-8">
          <h1 className="text-2xl font-bold text-[#1E3A8A]">
            Trip not found
          </h1>

          <p className="mt-2 text-gray-500">
            {error || "This trip may have been deleted."}
          </p>

          <Link
            to="/trips"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <ArrowLeft size={18} />
            Back to My Trips
          </Link>
        </main>
      </div>
    );
  }

const storedUser =
  localStorage.getItem("campusTripCurrentUser");

let currentUserId = "";

try {
  const currentUser = JSON.parse(storedUser || "{}");

  currentUserId =
    currentUser._id ||
    currentUser.id ||
    "";
} catch {
  currentUserId = storedUser || "";
}

const isTripOwner =
  String(trip.owner?._id || trip.owner) === String(currentUserId);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="trip-details-page flex flex-1 flex-col gap-8 p-6 pt-20 md:p-8">

        {/* Back */}
        <Link
          to="/trips"
          className="inline-flex items-center gap-2 font-medium text-blue-700 hover:underline"
        >
          <ArrowLeft size={18} />
          Back to My Trips
        </Link>

        {/* Trip Header */}
        <section className="trip-details-header overflow-hidden rounded-3xl bg-white shadow-lg">

          <div className="trip-details-cover flex h-52 items-center justify-center bg-[#E5F6FD] text-7xl">
            🚌
          </div>

          <div className="p-6 md:p-8">

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

              <div>

                <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                  {trip.status}
                </span>

                <h1 className="mt-4 text-3xl font-bold text-[#1E3A8A] md:text-4xl">
                  {trip.title}
                </h1>

                <div className="mt-4 flex flex-col gap-2 text-gray-500 sm:flex-row sm:gap-6">

                  <p className="flex items-center gap-2">
                    <MapPin size={18} />
                    {trip.destination}
                  </p>

                  <p className="flex items-center gap-2">
                    <CalendarDays size={18} />
                    {formatDate(
                      trip.startDate,
                      trip.endDate
                    )}
                  </p>

                </div>

              </div>

              <div className="flex flex-wrap gap-3">

                {isTripOwner && (
                  <Link
                    to={`/trips/${trip._id}/edit`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#1E3A8A] px-5 py-3 font-semibold text-[#1E3A8A] hover:bg-blue-50"
                  >
                    <Pencil size={18} />
                    Edit Trip
                  </Link>
                )}

                <Link
                  to="/members"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  <UserPlus size={18} />
                  Invite Members
                </Link>

              </div>

            </div>

          </div>
        </section>

        {/* Trip Information */}
        <section className="trip-info-grid grid gap-6 md:grid-cols-3">

          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <Bus className="text-[#1E3A8A]" size={25} />

            <p className="mt-5 text-sm text-gray-500">
              Transportation
            </p>

            <p className="mt-1 text-xl font-bold text-gray-800">
              {trip.transportation}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <Users className="text-[#1E3A8A]" size={25} />

            <p className="mt-5 text-sm text-gray-500">
              Maximum members
            </p>

            <p className="mt-1 text-xl font-bold text-gray-800">
              {trip.members} students
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <Wallet className="text-[#1E3A8A]" size={25} />

            <p className="mt-5 text-sm text-gray-500">
              Trip budget
            </p>

            <p className="mt-1 text-xl font-bold text-gray-800">
              {currency.format(trip.budget)}
            </p>
          </div>

        </section>
        {/* Join Trip */}
<section className="rounded-3xl bg-white p-6 shadow-lg md:p-8">

  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

    <div>
      <p className="text-sm font-semibold text-blue-700">
        INVITE STUDENTS
      </p>

      <h2 className="mt-1 text-2xl font-bold text-[#1E3A8A]">
        Join This Trip
      </h2>

      <p className="mt-2 max-w-xl text-gray-500">
        Students can enter the 6-digit code or scan the QR code
        to join this trip.
      </p>

      <div className="mt-5">
        <p className="text-sm font-medium text-gray-500">
          6-Digit Join Code
        </p>

        <p className="mt-2 text-4xl font-bold tracking-[0.3em] text-[#1E3A8A]">
          {trip.joinCode || "------"}
        </p>

        <button
  type="button"
  onClick={async () => {
    if (!trip.joinCode) return;

    try {
      await navigator.clipboard.writeText(trip.joinCode);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy join code:", error);
    }
  }}
  className="mt-4 rounded-xl bg-[#1E3A8A] px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
>
  {copied ? "✓ Copied!" : "Copy Code"}
</button>
      </div>
    </div>

    <div className="flex justify-center">
      {trip.joinCode ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <QRCodeSVG
            value={`${window.location.origin}/join-trip?code=${trip.joinCode}`}
            size={190}
            level="H"
          />
        </div>
      ) : (
        <div className="rounded-2xl bg-slate-50 p-10 text-sm text-gray-400">
          QR code unavailable
        </div>
      )}
    </div>

  </div>

</section>
        {/* About */}
        <section className="rounded-3xl bg-white p-6 shadow-lg md:p-8">

          <h2 className="text-2xl font-bold text-[#1E3A8A]">
            About this trip
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-gray-600">
            {trip.description}
          </p>

        </section>

        {/* Schedule */}
        <section className="rounded-3xl bg-white p-6 shadow-lg md:p-8">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-2xl font-bold text-[#1E3A8A]">
                Trip Schedule
              </h2>

              <p className="mt-1 text-gray-500">
                Plan activities and important times for this trip.
              </p>
            </div>

            {isTripOwner && (
  <button
    type="button"
    onClick={() => setIsScheduleFormOpen(true)}
    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-3 font-semibold text-white hover:bg-blue-700"
  >
    <Plus size={19} />
    Add Schedule
  </button>
)}

          </div>

          {scheduleError && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {scheduleError}
            </div>
          )}

          {scheduleLoading ? (
            <div className="mt-6 rounded-2xl bg-slate-50 p-8 text-center">
              <p className="text-gray-500">
                Loading schedule...
              </p>
            </div>
          ) : schedules.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-[#E5F6FD] p-8 text-center">

              <CalendarDays
                className="mx-auto text-[#1E3A8A]"
                size={38}
              />

              <h3 className="mt-4 font-semibold text-gray-800">
                No schedule yet
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Add your first activity to start planning.
              </p>

            </div>
          ) : (
            <div className="mt-6 space-y-4">

              {schedules.map((schedule) => (

                <div
                  key={schedule._id}
                  className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-slate-50 p-5 md:flex-row md:items-center"
                >

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#E5F6FD] text-[#1E3A8A]">
                    <Clock size={25} />
                  </div>

                  <div className="flex-1">

                    <div className="flex flex-wrap items-center gap-3">

                      <h3 className="font-bold text-gray-800">
                        {schedule.activity}
                      </h3>

                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                        {schedule.time}
                      </span>

                    </div>

                    <p className="mt-1 text-sm font-medium text-[#1E3A8A]">
                      {formatScheduleDate(schedule.date)}
                    </p>

                    {schedule.location && (
                      <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                        <MapPin size={15} />
                        {schedule.location}
                      </p>
                    )}

                    {schedule.notes && (
                      <p className="mt-2 text-sm text-gray-500">
                        {schedule.notes}
                      </p>
                    )}

                  </div>

                  {isTripOwner && (
                    <button
                      type="button"
                      onClick={() => handleDeleteSchedule(schedule._id)}
                      className="self-start rounded-xl border border-red-200 p-3 text-red-600 hover:bg-red-50 md:self-center"
                      aria-label={`Delete ${schedule.activity}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  )}

                </div>

              ))}

            </div>
          )}

        </section>

{/* Polls */}
<section className="rounded-3xl bg-white p-6 shadow-lg md:p-8">

  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

    <div>
      <p className="text-sm font-semibold text-blue-700">
        GROUP DECISION
      </p>

      <h2 className="mt-1 text-2xl font-bold text-[#1E3A8A]">
        Polls & Voting
      </h2>

      <p className="mt-1 text-gray-500">
        Let trip members vote and make decisions together.
      </p>
    </div>

    {isTripOwner && (
  <button
    type="button"
    onClick={() => {
      setPollError("");
      setIsPollFormOpen(true);
    }}
    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-3 font-semibold text-white hover:bg-blue-700"
  >
    <Plus size={19} />
    Create Poll
  </button>
)}

  </div>

  {pollError && (
    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
      {pollError}
    </div>
  )}

  {pollLoading ? (
    <div className="mt-6 rounded-2xl bg-slate-50 p-8 text-center">
      <p className="text-gray-500">
        Loading polls...
      </p>
    </div>
  ) : polls.length === 0 ? (
    <div className="mt-6 rounded-2xl bg-[#E5F6FD] p-8 text-center">

      <div className="text-4xl">
        🗳️
      </div>

      <h3 className="mt-4 font-semibold text-gray-800">
        No polls yet
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        Create a poll to let members make group decisions.
      </p>

    </div>
  ) : (
    <div className="mt-6 space-y-5">

      {polls.map((poll) => {

        const totalVotes = poll.options.reduce(
          (total, option) => total + option.votes,
          0
        );

        return (
          <div
            key={poll._id}
            className="rounded-2xl border border-gray-100 bg-slate-50 p-5"
          >

            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

              <div>
                <div className="flex flex-wrap items-center gap-2">

                  <h3 className="text-lg font-bold text-gray-800">
                    {poll.question}
                  </h3>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      poll.status === "Open"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {poll.status}
                  </span>

                </div>

                <p className="mt-1 text-xs text-gray-500">
                  {totalVotes}{" "}
                  {totalVotes === 1 ? "vote" : "votes"}
                </p>
              </div>

              {isTripOwner && (
                <button
                  type="button"
                  onClick={() =>
                    handleClosePoll(poll._id)}
                  disabled={poll.status === "Closed"}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Close Poll
                </button>
              )}

            </div>

            <div className="mt-5 space-y-3">

              {poll.options.map((option) => {

                const percentage =
                  totalVotes > 0
                    ? Math.round(
                        (option.votes / totalVotes) * 100
                      )
                    : 0;

                return (
                  <div
                    key={option._id}
                    className="rounded-xl border border-gray-200 bg-white p-3"
                  >

                    <div className="flex items-center justify-between gap-3">

                      <span className="font-medium text-gray-700">
                        {option.text}
                      </span>

                      <span className="text-sm font-semibold text-[#1E3A8A]">
                        {option.votes}
                      </span>

                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">

                      <div
                        className="h-full rounded-full bg-[#1E3A8A] transition-all"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                    <div className="mt-1 text-right text-xs text-gray-400">
                      {percentage}%
                    </div>

                    {poll.status === "Open" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleVote(
                            poll._id,
                            option._id
                          )
                        }
                        className="mt-2 w-full rounded-lg border border-[#1E3A8A] px-3 py-2 text-sm font-semibold text-[#1E3A8A] hover:bg-blue-50"
                      >
                        Vote
                      </button>
                    )}

                  </div>
                );
              })}

            </div>

          </div>
        );
      })}

    </div>
  )}

</section>

{/* Discussion */}
<section className="rounded-3xl bg-white p-6 shadow-lg md:p-8">

  <div>
    <p className="text-sm font-semibold text-blue-700">
      GROUP DISCUSSION
    </p>

    <h2 className="mt-1 text-2xl font-bold text-[#1E3A8A]">
      Discussion
    </h2>

    <p className="mt-1 text-gray-500">
      Discuss plans and ideas with your trip members.
    </p>
  </div>

  {discussionError && (
    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
      {discussionError}
    </div>
  )}

  {discussionLoading ? (
    <div className="mt-6 rounded-2xl bg-slate-50 p-8 text-center">
      <p className="text-gray-500">
        Loading discussion...
      </p>
    </div>
  ) : (
    <>
      <div className="mt-6 max-h-96 space-y-4 overflow-y-auto rounded-2xl bg-slate-50 p-4">

        {messages.length === 0 ? (
          <div className="py-10 text-center">
            <div className="text-4xl">💬</div>

            <p className="mt-3 font-semibold text-gray-700">
              No messages yet
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Start the conversation with your trip members.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className="rounded-2xl bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">

                <div>
                  <p className="font-semibold text-[#1E3A8A]">
                    {message.user?.name || "Trip Member"}
                  </p>

                  <p className="mt-1 text-sm text-gray-700">
                    {message.message}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    {new Date(
                      message.createdAt
                    ).toLocaleString()}
                  </p>
                </div>

                {String(message.user?._id) === String(currentUserId) && (
                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteMessage(
                        message._id
                      )
                    }
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                    aria-label="Delete message"
                  >
                    <Trash2 size={17} />
                  </button>
                )}

              </div>
            </div>
          ))
        )}

      </div>

      <form
        onSubmit={handleSendMessage}
        className="mt-5 flex flex-col gap-3 sm:flex-row"
      >
        <input
          value={newMessage}
          onChange={(event) =>
            setNewMessage(event.target.value)
          }
          maxLength={500}
          placeholder="Write a message..."
          className="flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#1E3A8A]"
        />

        <button
          type="submit"
          disabled={
            sendingMessage ||
            !newMessage.trim()
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={18} />

          {sendingMessage
            ? "Sending..."
            : "Send"}
        </button>
      </form>
    </>
  )}

</section>

        {/* Weather Placeholder */}
        <section className="rounded-3xl bg-white p-6 shadow-lg md:p-8">

  <div className="flex items-center justify-between">

    <div>
      <h2 className="text-2xl font-bold text-[#1E3A8A]">
        Weather
      </h2>

      <p className="mt-1 text-gray-500">
        Current weather in {trip.destination}
      </p>
    </div>

    <div className="text-4xl">
      🌤️
    </div>

  </div>

  {weatherLoading && (
    <div className="mt-6 rounded-2xl bg-[#E5F6FD] p-8 text-center">
      <p className="text-gray-500">
        Loading weather...
      </p>
    </div>
  )}

  {!weatherLoading && weatherError && (
    <div className="mt-6 rounded-2xl bg-red-50 p-5 text-red-600">
      <p className="font-medium">
        Unable to load weather
      </p>

      <p className="mt-1 text-sm">
        {weatherError}
      </p>
    </div>
  )}

  {!weatherLoading && !weatherError && weather && (
    <div className="mt-6 grid gap-5 md:grid-cols-4">

      {/* Temperature */}
      <div className="rounded-2xl bg-[#E5F6FD] p-5">

        <p className="text-sm text-gray-500">
          Temperature
        </p>

        <p className="mt-2 text-3xl font-bold text-[#1E3A8A]">
          {Math.round(weather.temperature)}°C
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Feels like {Math.round(weather.feelsLike)}°C
        </p>

      </div>

      {/* Condition */}
      <div className="rounded-2xl bg-[#E5F6FD] p-5">

        <p className="text-sm text-gray-500">
          Condition
        </p>

        <p className="mt-2 text-xl font-bold capitalize text-[#1E3A8A]">
          {weather.description}
        </p>

      </div>

      {/* Humidity */}
      <div className="rounded-2xl bg-[#E5F6FD] p-5">

        <p className="text-sm text-gray-500">
          Humidity
        </p>

        <p className="mt-2 text-3xl font-bold text-[#1E3A8A]">
          {weather.humidity}%
        </p>

      </div>

      {/* Wind */}
      <div className="rounded-2xl bg-[#E5F6FD] p-5">

        <p className="text-sm text-gray-500">
          Wind
        </p>

        <p className="mt-2 text-3xl font-bold text-[#1E3A8A]">
          {weather.windSpeed}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          m/s
        </p>

      </div>

    </div>
  )}

</section>

        {/* Danger Zone */}
        <section className="rounded-3xl border border-red-100 bg-white p-6 shadow-lg md:p-8">

          <h2 className="text-xl font-bold text-red-600">
            Danger zone
          </h2>

          <p className="mt-2 text-gray-500">
            Deleting a trip permanently removes it from your account.
          </p>

          <button
            type="button"
            onClick={handleDeleteTrip}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
          >
            <Trash2 size={18} />
            Delete Trip
          </button>

        </section>

      </main>


  
      {/* Add Schedule Modal */}
      {isScheduleFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">

          <form
            onSubmit={handleCreateSchedule}
            className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"
          >

            <h2 className="text-2xl font-bold text-[#1E3A8A]">
              Add Schedule
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Add an activity to your trip schedule.
            </p>

            <div className="mt-6 space-y-4">

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Date
                </label>

                <input
                  required
                  type="date"
                  name="date"
                  min={trip.startDate.slice(0, 10)}
                  max={trip.endDate.slice(0, 10)}
                  value={scheduleForm.date}
                  onChange={handleScheduleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Time
                </label>

                <input
                  required
                  type="time"
                  name="time"
                  value={scheduleForm.time}
                  onChange={handleScheduleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Activity
                </label>

                <input
                  required
                  name="activity"
                  value={scheduleForm.activity}
                  onChange={handleScheduleChange}
                  placeholder="e.g. Visit campus"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Location
                </label>

                <input
                  name="location"
                  value={scheduleForm.location}
                  onChange={handleScheduleChange}
                  placeholder="e.g. Bangkok University"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Notes
                </label>

                <textarea
                  name="notes"
                  rows="3"
                  value={scheduleForm.notes}
                  onChange={handleScheduleChange}
                  placeholder="Optional notes..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#1E3A8A]"
                />
              </div>

            </div>

            <div className="mt-7 flex justify-end gap-3">

              <button
                type="button"
                onClick={() => setIsScheduleFormOpen(false)}
                className="rounded-xl border border-gray-300 px-5 py-3 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={savingSchedule}
                className="rounded-xl bg-[#1E3A8A] px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingSchedule
                  ? "Saving..."
                  : "Add Schedule"}
              </button>

            </div>

          </form>

        </div>
      )}
      {/* Create Poll Modal */}
      {isPollFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <form
            onSubmit={handleCreatePoll}
            className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-[#1E3A8A]">
              Create Poll
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Ask your trip members to vote on a group decision.
            </p>

            <div className="mt-6 space-y-4">
              {/* Question */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Question
                </label>

                <input
                  required
                  value={pollForm.question}
                  onChange={(event) =>
                    setPollForm((current) => ({
                      ...current,
                      question: event.target.value,
                    }))
                  }
                  placeholder="e.g. Where should we eat?"
                  maxLength={200}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#1E3A8A]"
                />
              </div>

              {/* Options */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Options
                </label>

                <div className="space-y-3">
                  {pollForm.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2"
                    >
                      <input
                        required
                        value={option}
                        onChange={(event) =>
                          handlePollOptionChange(
                            index,
                            event.target.value
                          )
                        }
                        placeholder={`Option ${index + 1}`}
                        maxLength={120}
                        className="flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#1E3A8A]"
                      />

                      {pollForm.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removePollOption(index)}
                          className="rounded-xl border border-red-200 p-3 text-red-600 hover:bg-red-50"
                          aria-label={`Remove option ${index + 1}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {pollForm.options.length < 6 && (
                  <button
                    type="button"
                    onClick={addPollOption}
                    className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[#1E3A8A] px-4 py-2 text-sm font-semibold text-[#1E3A8A] hover:bg-blue-50"
                  >
                    <Plus size={17} />
                    Add Option
                  </button>
                )}
              </div>
            </div>

            {pollError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {pollError}
              </div>
            )}

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsPollFormOpen(false);
                  setPollError("");
                }}
                className="rounded-xl border border-gray-300 px-5 py-3 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={savingPoll}
                className="rounded-xl bg-[#1E3A8A] px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingPoll ? "Creating..." : "Create Poll"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default TripDetails;
