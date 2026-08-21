import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Cloud,
  Clock3,
  CloudRain,
  Droplets,
  MapPin,
  Plus,
  Users,
  Wallet,
  Wind,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import {
  getCurrentUser,
  getTrips,
  getExpenses,
  getChecklistItems,
  getMembers,
  getWeather,
  getSchedules,
} from "../../api/authApi";

const currency = new Intl.NumberFormat("en-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
});

function parseDate(date) {
  if (!date) return null;

  if (date instanceof Date) {
    return date;
  }

  if (typeof date === "string" && date.includes("T")) {
    return new Date(date);
  }

  return new Date(`${date}T00:00:00`);
}

function formatDate(date) {
  const parsedDate = parseDate(date);

  if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDaysUntil(date) {
  const tripDate = parseDate(date);

  if (!tripDate || Number.isNaN(tripDate.getTime())) {
    return null;
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  tripDate.setHours(0, 0, 0, 0);

  const difference =
    tripDate.getTime() - today.getTime();

  return Math.max(
    0,
    Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    )
  );
}


function getWeatherIcon(description = "") {
  const value = description.toLowerCase();

  if (
    value.includes("rain") ||
    value.includes("drizzle")
  ) {
    return <CloudRain size={42} />;
  }

  return <Cloud size={42} />;
}

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
const [trips, setTrips] = useState([]);
const [expenses, setExpenses] = useState([]);
const [checklist, setChecklist] = useState([]);
const [members, setMembers] = useState([]);
const [weather, setWeather] = useState(null);
const [schedules, setSchedules] = useState([]);

  const [loading, setLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token =
          localStorage.getItem("campusTripToken");

        if (!token) {
          navigate("/login");
          return;
        }

        const [userData, tripsData] =
          await Promise.all([
            getCurrentUser(token),
            getTrips(token),
          ]);

        setUser(userData.user);
        setTrips(tripsData.trips);

        if (tripsData.trips.length === 0) {
          setLoading(false);
          return;
        }

        const sortedTrips = [...tripsData.trips].sort(
          (a, b) =>
            new Date(a.startDate) -
            new Date(b.startDate)
        );

        const nextTrip =
          sortedTrips.find(
            (trip) =>
              trip.status === "Planning" ||
              trip.status === "Upcoming"
          ) || sortedTrips[0];

        const [
  expensesData,
  checklistData,
  membersData,
  schedulesData,
] = await Promise.all([
  getExpenses(token, nextTrip._id),
  getChecklistItems(token, nextTrip._id),
  getMembers(token, nextTrip._id),
  getSchedules(nextTrip._id, token),
]);

setExpenses(expensesData.expenses);
setChecklist(checklistData.items);
setMembers(membersData.members);
setSchedules(schedulesData.schedules);

        try {
          setWeatherLoading(true);

          const weatherData = await getWeather(
            nextTrip.destination,
            token
          );

          setWeather(weatherData);
        } catch (weatherError) {
          console.error(
            "Weather loading failed:",
            weatherError
          );
        } finally {
          setWeatherLoading(false);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const upcomingTrip = useMemo(() => {
    if (!trips.length) return null;

    const sorted = [...trips].sort(
      (a, b) =>
        new Date(a.startDate) -
        new Date(b.startDate)
    );

    return (
      sorted.find(
        (trip) =>
          trip.status === "Planning" ||
          trip.status === "Upcoming"
      ) || sorted[0]
    );
  }, [trips]);

  const spent = useMemo(
    () =>
      expenses.reduce(
        (total, expense) =>
          total + Number(expense.amount),
        0
      ),
    [expenses]
  );

  const totalBudget =
    upcomingTrip?.budget ?? 0;

  const remainingBudget =
    totalBudget - spent;

  const budgetPercentage =
    totalBudget > 0
      ? Math.min(
          Math.round((spent / totalBudget) * 100),
          100
        )
      : 0;

  const completedItems = checklist.filter(
    (item) => item.completed
  ).length;

  const checklistProgress = checklist.length
    ? Math.round(
        (completedItems / checklist.length) * 100
      )
    : 0;

  const memberPercentage =
    upcomingTrip?.members > 0
      ? Math.min(
          Math.round(
            (members.length /
              upcomingTrip.members) *
              100
          ),
          100
        )
      : 0;

  const daysUntilTrip = upcomingTrip
    ? getDaysUntil(upcomingTrip.startDate)
    : 0;

    const nextActivity = useMemo(() => {
  if (!schedules.length) return null;

  const now = new Date();

  const upcoming = [...schedules]
    .map((schedule) => {
      const date = parseDate(schedule.date);

      if (!date || Number.isNaN(date.getTime())) {
        return null;
      }

      const [hours = 0, minutes = 0] =
        String(schedule.time || "00:00")
          .split(":")
          .map(Number);

      date.setHours(hours, minutes, 0, 0);

      return {
        ...schedule,
        dateTime: date,
      };
    })
    .filter(
      (schedule) =>
        schedule &&
        schedule.dateTime >= now
    )
    .sort(
      (a, b) =>
        a.dateTime.getTime() -
        b.dateTime.getTime()
    );

  return upcoming[0] || null;
}, [schedules]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />

        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-[#1E3A8A]" />

            <p className="mt-4 text-gray-500">
              Loading your dashboard...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

     {/* MOBILE ONLY */}
<main className="md:hidden h-[100dvh] overflow-hidden pt-20">
  <div className="flex h-full flex-col px-4 pb-4">

    {upcomingTrip ? (
      <>
        {/* Header */}
        <div className="shrink-0 pt-2">
          <p className="text-sm font-semibold text-blue-700">
            CampusTrip
          </p>

          <div className="mt-1 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h1 className="truncate text-[28px] font-bold leading-tight tracking-tight text-[#1E3A8A]">
                Welcome back
                {user?.name
                  ? `, ${user.name.split(" ")[0]}`
                  : ""}
                ! 👋
              </h1>

              <p className="mt-1 truncate text-sm text-gray-500">
                Your trip at a glance
              </p>
            </div>

            <Link
              to="/trips/create"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1E3A8A] text-white shadow-md"
            >
              <Plus size={22} />
            </Link>
          </div>
        </div>

        {/* Trip */}
        <section className="mt-3 shrink-0 rounded-[24px] bg-[#1E3A8A] p-4 text-white shadow-lg">
          <div className="flex items-center justify-between gap-2">

            <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold">
              {upcomingTrip.status}
            </span>

            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-blue-100">
              {daysUntilTrip === 0
                ? "Today"
                : `${daysUntilTrip} days to go`}
            </span>

          </div>

          <h2 className="mt-3 truncate text-[27px] font-bold leading-tight">
            {upcomingTrip.title}
          </h2>

          <div className="mt-2 space-y-1 text-sm text-blue-100">

            <p className="flex min-w-0 items-center gap-2">
              <MapPin size={15} className="shrink-0" />
              <span className="truncate">
                {upcomingTrip.destination}
              </span>
            </p>

            <p className="flex items-center gap-2">
              <CalendarDays size={15} className="shrink-0" />

              <span className="truncate">
                {formatDate(upcomingTrip.startDate)}
                {" – "}
                {formatDate(upcomingTrip.endDate)}
              </span>
            </p>

          </div>

          <Link
            to={`/trips/${upcomingTrip._id}`}
            className="mt-3 flex h-11 items-center justify-center gap-2 rounded-xl bg-white font-semibold text-[#1E3A8A]"
          >
            View Trip
            <ArrowRight size={17} />
          </Link>
        </section>

        {/* Dashboard cards */}
        <section className="mt-3 grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-3">

          {/* Budget */}
          <Link
            to="/budget"
            className="min-w-0 overflow-hidden rounded-[22px] bg-white p-3.5 shadow-md"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E5F6FD] text-[#1E3A8A]">
                <Wallet size={18} />
              </div>

              <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Budget
              </span>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Left
            </p>

            <p
              className={`mt-0.5 truncate text-[19px] font-bold tracking-tight ${
                remainingBudget >= 0
                  ? "text-[#1E3A8A]"
                  : "text-red-600"
              }`}
            >
              {currency.format(remainingBudget)}
            </p>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-[#1E3A8A]"
                style={{
                  width: `${budgetPercentage}%`,
                }}
              />
            </div>

            <p className="mt-1 text-[10px] text-gray-400">
              {budgetPercentage}% used
            </p>
          </Link>

          {/* Checklist */}
          <Link
            to="/checklist"
            className="min-w-0 overflow-hidden rounded-[22px] bg-white p-3.5 shadow-md"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E5F6FD] text-[#1E3A8A]">
                <CheckCircle2 size={18} />
              </div>

              <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Packing
              </span>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Ready
            </p>

            <p className="mt-0.5 text-[23px] font-bold text-[#1E3A8A]">
              {checklistProgress}%
            </p>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-[#1E3A8A]"
                style={{
                  width: `${checklistProgress}%`,
                }}
              />
            </div>

            <p className="mt-1 truncate text-[10px] text-gray-400">
              {completedItems} of {checklist.length} items
            </p>
          </Link>

          {/* Weather */}
          <div className="min-w-0 overflow-hidden rounded-[22px] bg-[#E5F6FD] p-3.5 shadow-md">
            <div className="flex items-center justify-between gap-2">

              <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-700">
                Weather
              </span>

              <div className="text-[#1E3A8A]">
                {weather
                  ? getWeatherIcon(weather.description)
                  : <Cloud size={20} />}
              </div>

            </div>

            {weather ? (
              <>
                <p className="mt-2 truncate text-xs text-gray-600">
                  {weather.city}, {weather.country}
                </p>

                <p className="mt-0.5 text-[25px] font-bold text-[#1E3A8A]">
                  {Math.round(weather.temperature)}°C
                </p>

                <p className="truncate text-[10px] capitalize text-gray-500">
                  {weather.description}
                </p>
              </>
            ) : (
              <p className="mt-4 text-xs text-gray-400">
                {weatherLoading
                  ? "Loading..."
                  : "Unavailable"}
              </p>
            )}
          </div>

          {/* Schedule */}
          <Link
            to="/schedule"
            className="min-w-0 overflow-hidden rounded-[22px] bg-white p-3.5 shadow-md"
          >
            <div className="flex items-center justify-between gap-2">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E5F6FD] text-[#1E3A8A]">
                <Clock3 size={18} />
              </div>

              <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Next
              </span>

            </div>

            {nextActivity ? (
              <>
                <p className="mt-2 truncate text-sm font-bold text-[#1E3A8A]">
                  {nextActivity.activity}
                </p>

                <p className="mt-1 truncate text-[10px] text-gray-500">
                  {formatDate(nextActivity.date)}
                  {" · "}
                  {nextActivity.time}
                </p>
              </>
            ) : (
              <>
                <p className="mt-2 text-sm font-bold text-gray-700">
                  No activity
                </p>

                <p className="mt-1 text-[10px] text-gray-400">
                  Add one in Schedule
                </p>
              </>
            )}
          </Link>

        </section>

        {/* Bottom info */}
        <div className="mt-3 flex shrink-0 items-center justify-between rounded-2xl bg-white px-4 py-2.5 text-xs shadow-sm">

          <span className="flex items-center gap-1.5 text-gray-500">
            <Users size={14} />
            {members.length}/{upcomingTrip.members}
          </span>

          <span className="text-gray-500">
            {weather
              ? `${weather.humidity}% humidity`
              : "Weather"}
          </span>

          <Link
            to="/trips"
            className="font-semibold text-[#1E3A8A]"
          >
            Trips →
          </Link>

        </div>
      </>
    ) : (
      /* No trip */
      <div className="flex flex-1 flex-col items-center justify-center text-center px-6">

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E5F6FD] text-[#1E3A8A]">
          <MapPin size={30} />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-[#1E3A8A]">
          No trips yet
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Create your first campus trip and start organizing your journey.
        </p>

        <Link
          to="/trips/create"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-6 py-3 font-semibold text-white"
        >
          <Plus size={19} />
          Create Your First Trip
        </Link>

      </div>
    )}

  </div>
</main>
      
      {/* DESKTOP ONLY */}
      <main className="flex flex-1 flex-col gap-7 p-5 pt-20 md:p-8">

        {/* ───────── Header ───────── */}
        <section className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm font-semibold text-blue-700">
              CampusTrip
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#1E3A8A] md:text-4xl">
              Welcome back
              {user?.name
                ? `, ${user.name.split(" ")[0]}`
                : ""}
              ! 👋
            </h1>

            <p className="mt-2 text-gray-500">
              Everything you need for your next campus trip.
            </p>
          </div>

          <Link
            to="/trips/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700"
          >
            <Plus size={19} />
            New Trip
          </Link>

        </section>

        {/* ───────── Error ───────── */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ───────── No Trips ───────── */}
        {!upcomingTrip ? (
          <section className="rounded-3xl bg-white p-10 text-center shadow-lg">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E5F6FD] text-[#1E3A8A]">
              <MapPin size={30} />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-[#1E3A8A]">
              No trips yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              Create your first campus trip and start organizing your journey.
            </p>

            <Link
              to="/trips/create"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={19} />
              Create Your First Trip
            </Link>

          </section>
        ) : (
          <>
            {/* ───────── Hero / Next Trip ───────── */}
            <section className="overflow-hidden rounded-3xl bg-[#1E3A8A] shadow-xl">

              <div className="p-6 text-white md:p-8">

                <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-3">

                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                        {upcomingTrip.status}
                      </span>

                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-blue-100">
                        {daysUntilTrip === null
                          ? "Trip date unavailable"
                          : daysUntilTrip === 0
                            ? "Trip starts today"
                            : `${daysUntilTrip} days to go`}
                      </span>

                    </div>

                    <h2 className="mt-4 text-3xl font-bold md:text-4xl">
                      {upcomingTrip.title}
                    </h2>

                    <div className="mt-4 flex flex-col gap-3 text-blue-100 sm:flex-row sm:flex-wrap sm:gap-6">

                      <p className="flex items-center gap-2">
                        <MapPin size={18} />
                        {upcomingTrip.destination}
                      </p>

                      <p className="flex items-center gap-2">
                        <CalendarDays size={18} />

                        {formatDate(
                          upcomingTrip.startDate
                        )}

                        {" – "}

                        {formatDate(
                          upcomingTrip.endDate
                        )}
                      </p>

                    </div>

                  </div>

                  <Link
                    to={`/trips/${upcomingTrip._id}`}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-[#1E3A8A] transition hover:bg-blue-50"
                  >
                    View Trip
                    <ArrowRight size={18} />
                  </Link>

                </div>

              </div>

            </section>

            {/* ───────── Main Stats ───────── */}
            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

              {/* Budget */}
              <div className="rounded-3xl bg-white p-6 shadow-lg">

                <div className="flex items-center justify-between">

                  <div className="rounded-2xl bg-[#E5F6FD] p-3 text-[#1E3A8A]">
                    <Wallet size={23} />
                  </div>

                  <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Budget
                  </span>

                </div>

                <p className="mt-5 text-sm text-gray-500">
                  Remaining
                </p>

                <p
                  className={`mt-1 text-2xl font-bold ${
                    remainingBudget >= 0
                      ? "text-[#1E3A8A]"
                      : "text-red-600"
                  }`}
                >
                  {currency.format(
                    remainingBudget
                  )}
                </p>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${
                      budgetPercentage >= 90
                        ? "bg-red-500"
                        : "bg-[#1E3A8A]"
                    }`}
                    style={{
                      width: `${budgetPercentage}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  {budgetPercentage}% of budget used
                </p>

              </div>

              {/* Members */}
              <div className="rounded-3xl bg-white p-6 shadow-lg">

                <div className="flex items-center justify-between">

                  <div className="rounded-2xl bg-[#E5F6FD] p-3 text-[#1E3A8A]">
                    <Users size={23} />
                  </div>

                  <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Members
                  </span>

                </div>

                <p className="mt-5 text-sm text-gray-500">
                  Trip participants
                </p>

                <p className="mt-1 text-2xl font-bold text-[#1E3A8A]">
                  {members.length}
                  <span className="text-base font-medium text-gray-400">
                    {" "}
                    / {upcomingTrip.members}
                  </span>
                </p>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-[#1E3A8A]"
                    style={{
                      width: `${memberPercentage}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  {Math.max(
                    upcomingTrip.members -
                      members.length,
                    0
                  )}{" "}
                  spaces remaining
                </p>

              </div>

              {/* Checklist */}
              <div className="rounded-3xl bg-white p-6 shadow-lg">

                <div className="flex items-center justify-between">

                  <div className="rounded-2xl bg-[#E5F6FD] p-3 text-[#1E3A8A]">
                    <CheckCircle2 size={23} />
                  </div>

                  <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Checklist
                  </span>

                </div>

                <p className="mt-5 text-sm text-gray-500">
                  Packing progress
                </p>

                <p className="mt-1 text-2xl font-bold text-[#1E3A8A]">
                  {checklistProgress}%
                </p>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-[#1E3A8A]"
                    style={{
                      width: `${checklistProgress}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  {completedItems} of{" "}
                  {checklist.length} items ready
                </p>

              </div>

              {/* Weather */}
              <div className="rounded-3xl bg-white p-6 shadow-lg">

                <div className="flex items-center justify-between">

                  <div className="rounded-2xl bg-[#E5F6FD] p-3 text-[#1E3A8A]">
                    <Cloud size={23} />
                  </div>

                  <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Weather
                  </span>

                </div>

                {weatherLoading ? (
                  <div className="mt-6">
                    <p className="text-sm text-gray-400">
                      Loading weather...
                    </p>
                  </div>
                ) : weather ? (
                  <>
                    <div className="mt-4 flex items-center justify-between">

                      <div>
                        <p className="text-sm text-gray-500">
                          {weather.city},{" "}
                          {weather.country}
                        </p>

                        <p className="mt-1 text-3xl font-bold text-[#1E3A8A]">
                          {Math.round(
                            weather.temperature
                          )}
                          °C
                        </p>
                      </div>

                      <div className="text-[#1E3A8A]">
                        {getWeatherIcon(
                          weather.description
                        )}
                      </div>

                    </div>

                    <p className="mt-2 text-sm capitalize text-gray-600">
                      {weather.description}
                    </p>
                  </>
                ) : (
                  <div className="mt-6">
                    <p className="text-sm text-gray-400">
                      Weather unavailable
                    </p>
                  </div>
                )}

              </div>

            </section>

            {/* ───────── Two Main Panels ───────── */}
            <section className="grid gap-6 lg:grid-cols-2">
            
            {/* ───────── Next Activity ───────── */}
<section className="rounded-3xl bg-white p-6 shadow-lg md:p-7">

  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

    <div className="flex items-start gap-4">

      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E5F6FD] text-[#1E3A8A]">
        <Clock3 size={23} />
      </div>

      <div>

        <p className="text-sm font-semibold text-blue-700">
          NEXT ACTIVITY
        </p>

        {nextActivity ? (
          <>
            <h2 className="mt-1 text-2xl font-bold text-[#1E3A8A]">
              {nextActivity.activity}
            </h2>

            <div className="mt-2 flex flex-col gap-2 text-sm text-gray-500 sm:flex-row sm:gap-5">

              <span className="flex items-center gap-2">
                <CalendarDays size={15} />
                {formatDate(nextActivity.date)}
              </span>

              <span className="flex items-center gap-2">
                <Clock3 size={15} />
                {nextActivity.time}
              </span>

              {nextActivity.location && (
                <span className="flex items-center gap-2">
                  <MapPin size={15} />
                  {nextActivity.location}
                </span>
              )}

            </div>
          </>
        ) : (
          <>
            <h2 className="mt-1 text-xl font-bold text-gray-700">
              No upcoming activities
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add activities to your trip schedule.
            </p>
          </>
        )}

      </div>

    </div>

    <Link
      to="/schedule"
      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#1E3A8A] px-4 py-3 text-sm font-semibold text-[#1E3A8A] transition hover:bg-[#E5F6FD]"
    >
      View Schedule
      <ArrowRight size={16} />
    </Link>

  </div>

</section>

              {/* Checklist */}
              <div className="rounded-3xl bg-white p-6 shadow-lg md:p-7">

                <div className="flex items-start justify-between">

                  <div>
                    <h2 className="text-xl font-bold text-[#1E3A8A]">
                      Packing Checklist
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Make sure everything is ready.
                    </p>
                  </div>

                  <Link
                    to="/checklist"
                    className="text-sm font-semibold text-blue-700 hover:underline"
                  >
                    View all
                  </Link>

                </div>

                <div className="mt-7 flex items-center gap-6">

                  <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-[10px] border-[#E5F6FD]">

                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(#1E3A8A ${checklistProgress}%, #E5F6FD ${checklistProgress}% 100%)`,
                        mask:
                          "radial-gradient(farthest-side, transparent calc(100% - 10px), #000 0)",
                        WebkitMask:
                          "radial-gradient(farthest-side, transparent calc(100% - 10px), #000 0)",
                      }}
                    />

                    <span className="relative text-xl font-bold text-[#1E3A8A]">
                      {checklistProgress}%
                    </span>

                  </div>

                  <div>

                    <p className="text-lg font-semibold text-gray-800">
                      {completedItems} of{" "}
                      {checklist.length} ready
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Complete your packing before departure.
                    </p>

                    <Link
                      to="/checklist"
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#1E3A8A]"
                    >
                      Open checklist
                      <ArrowRight size={15} />
                    </Link>

                  </div>

                </div>

              </div>

              {/* Budget */}
              <div className="rounded-3xl bg-white p-6 shadow-lg md:p-7">

                <div className="flex items-start justify-between">

                  <div>
                    <h2 className="text-xl font-bold text-[#1E3A8A]">
                      Budget Overview
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Keep your trip spending under control.
                    </p>
                  </div>

                  <Link
                    to="/budget"
                    className="text-sm font-semibold text-blue-700 hover:underline"
                  >
                    View budget
                  </Link>

                </div>

                <div className="mt-7 grid grid-cols-3 gap-3">

                  <div className="rounded-2xl bg-[#E5F6FD] p-4">

                    <p className="text-xs text-gray-500">
                      Budget
                    </p>

                    <p className="mt-2 text-lg font-bold text-[#1E3A8A]">
                      {currency.format(
                        totalBudget
                      )}
                    </p>

                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4">

                    <p className="text-xs text-gray-500">
                      Spent
                    </p>

                    <p className="mt-2 text-lg font-bold text-gray-800">
                      {currency.format(spent)}
                    </p>

                  </div>

                  <div className="rounded-2xl bg-green-50 p-4">

                    <p className="text-xs text-gray-500">
                      Left
                    </p>

                    <p className="mt-2 text-lg font-bold text-green-700">
                      {currency.format(
                        remainingBudget
                      )}
                    </p>

                  </div>

                </div>

                <div className="mt-6 h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${
                      budgetPercentage >= 90
                        ? "bg-red-500"
                        : "bg-[#1E3A8A]"
                    }`}
                    style={{
                      width: `${budgetPercentage}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  {budgetPercentage}% of your trip budget has been used.
                </p>

              </div>

            </section>

            {/* ───────── Weather Details ───────── */}
            {weather && (
              <section className="rounded-3xl bg-[#E5F6FD] p-6 shadow-lg md:p-7">

                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                  <div>
                    <p className="text-sm font-semibold text-blue-700">
                      DESTINATION WEATHER
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-[#1E3A8A]">
                      {weather.city}, {weather.country}
                    </h2>

                    <p className="mt-2 capitalize text-gray-600">
                      {weather.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">

                    <div className="text-[#1E3A8A]">
                      {getWeatherIcon(
                        weather.description
                      )}
                    </div>

                    <div>
                      <p className="text-4xl font-bold text-[#1E3A8A]">
                        {Math.round(
                          weather.temperature
                        )}
                        °C
                      </p>

                      <p className="text-sm text-gray-500">
                        Feels like{" "}
                        {Math.round(
                          weather.feelsLike
                        )}
                        °C
                      </p>
                    </div>

                  </div>

                  <div className="flex gap-3">

                    <div className="rounded-2xl bg-white px-4 py-3">

                      <Droplets
                        size={18}
                        className="text-[#1E3A8A]"
                      />

                      <p className="mt-1 text-xs text-gray-500">
                        Humidity
                      </p>

                      <p className="font-bold text-gray-800">
                        {weather.humidity}%
                      </p>

                    </div>

                    <div className="rounded-2xl bg-white px-4 py-3">

                      <Wind
                        size={18}
                        className="text-[#1E3A8A]"
                      />

                      <p className="mt-1 text-xs text-gray-500">
                        Wind
                      </p>

                      <p className="font-bold text-gray-800">
                        {weather.windSpeed} m/s
                      </p>

                    </div>

                  </div>

                </div>

              </section>
            )}

            {/* ───────── Recent Trips ───────── */}
            <section className="rounded-3xl bg-white p-6 shadow-lg md:p-7">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold text-[#1E3A8A]">
                    Your Trips
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Manage your campus journeys.
                  </p>
                </div>

                <Link
                  to="/trips"
                  className="text-sm font-semibold text-blue-700 hover:underline"
                >
                  View all
                </Link>

              </div>

              <div className="mt-5 divide-y divide-gray-100">

                {trips.slice(0, 4).map((trip) => (
                  <Link
                    key={trip._id}
                    to={`/trips/${trip._id}`}
                    className="flex flex-col gap-3 py-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-3"
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E5F6FD] text-[#1E3A8A]">
                        <MapPin size={20} />
                      </div>

                      <div>

                        <h3 className="font-semibold text-gray-800">
                          {trip.title}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {trip.destination} ·{" "}
                          {formatDate(
                            trip.startDate
                          )}
                        </p>

                      </div>

                    </div>

                    <div className="flex items-center gap-3">

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                        {trip.status}
                      </span>

                      <ArrowRight
                        size={18}
                        className="text-gray-400"
                      />

                    </div>

                  </Link>
                ))}

              </div>

            </section>

          </>
        )}

      </main>
    </div>
  );
}

export default Dashboard;
