import Navbar from "../components/layout/Navbar";
import Button from "../components/ui/Button";
import DashboardPreview from "../components/dashboard/DashboardPreview";
import StatsCard from "../components/cards/StatsCard";
import FeatureCard from "../components/cards/FeatureCard";
import InfoCard from "../components/cards/InfoCard";
import StepCard from "../components/cards/StepCard";
import Footer from "../components/layout/Footer";
import BackgroundShapes from "../components/common/BackgroundShapes";
import { useNavigate } from "react-router-dom";

const TEAM_MEMBERS = [
  {
    name: "Yoon Pa Pa Aung",
    id: "240702404714",
    role: "Team Member",
    initials: "YP",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    name: "Htet Myat Naing",
    id: "250702401589",
    role: "Team Member",
    initials: "HM",
    gradient: "from-blue-600 to-indigo-600",
  },
  {
    name: "Saw Hsar Doh Soe",
    id: "240702404451",
    role: "Team Member",
    initials: "SH",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    name: "May Thiri Kyaw",
    id: "250702404285",
    role: "Team Member",
    initials: "MT",
    gradient: "from-purple-500 to-violet-600",
  },
  {
    name: "Ahmad Nikaji",
    id: "680702402678",
    role: "Team Member",
    initials: "AN",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    name: "Nayi Zin Minn",
    id: "240702404678",
    role: "Team Member",
    initials: "NZ",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    name: "Lian Khia",
    id: "240702404504",
    role: "Team Member",
    initials: "LK",
    gradient: "from-indigo-500 to-sky-500",
  },
];

function Landing() {
  const navigate = useNavigate();

  const isAuthenticated = Boolean(
    localStorage.getItem("campusTripToken")
  );

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-white via-slate-50 to-blue-50">
      <BackgroundShapes />

      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">

        {/* ================= 1. HERO SECTION ================= */}
        <section className="grid w-full grid-cols-1 items-center gap-10 py-10 sm:gap-14 sm:py-12 lg:grid-cols-2 lg:gap-24 lg:py-16">
          {/* Left */}
          <div className="min-w-0">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-blue-600 sm:text-base">
              PLAN SMARTER. TRAVEL TOGETHER.
            </p>

            <div className="mb-5 hidden items-center gap-2 rounded-full border border-blue-100 bg-white/90 px-4 py-1.5 shadow-sm lg:inline-flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-gray-700">
                Official Student Project & Trip Management Platform
              </span>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl xl:text-6xl">
              Plan Your
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                Campus Trip
              </span>
              <br />
              With Ease.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              CampusTrip helps students organize campus trips with schedules,
              weather forecasts, expense tracking, packing checklists, and
              real-time collaboration — all in one modern platform.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:gap-4">
              <Button
                onClick={() =>
                  navigate(isAuthenticated ? "/dashboard" : "/register")
                }
              >
                🚀 Get Started
              </Button>

              <Button
                variant="secondary"
                onClick={() =>
                  document
                    .getElementById("team")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                👥 Meet Our Team
              </Button>

              <button
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-5 py-3 rounded-xl border border-gray-200 bg-white/80 text-sm font-semibold text-gray-700 hover:bg-white hover:text-blue-600 transition shadow-sm cursor-pointer"
              >
                ⚡ Main Function Steps
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs sm:text-sm font-medium text-gray-600">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-600">✓</span> Free for Students
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-600">✓</span> Real-Time Discussion
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-600">✓</span> Fair Expense Splitting
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="flex w-full min-w-0 justify-center overflow-hidden">
            <div className="w-full min-w-0 max-w-[520px]">
              <DashboardPreview />
            </div>
          </div>
        </section>


        {/* ================= 2. TEAM MEMBERS (FIRST SECTION) ================= */}
        <section
          id="team"
          className="w-full py-12 sm:py-16 scroll-mt-24 border-t border-blue-100/60"
        >
          <div className="mb-10 text-center sm:mb-12">
            <span className="inline-block rounded-full bg-blue-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
              OUR TEAM & CONTRIBUTORS
            </span>

            <h2 className="mt-3 text-2xl font-extrabold text-[#1E3A8A] sm:text-3xl lg:text-4xl">
              CampusTrip Team Members
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
              Meet the 7 dedicated students who designed and built CampusTrip.
            </p>
          </div>

          {/* Team Members Grid */}
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {TEAM_MEMBERS.map((member, index) => (
              <div
                key={member.id}
                className="group relative flex flex-col items-center rounded-2xl border border-blue-100/80 bg-white/95 p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-xl"
              >
                {/* Number Badge */}
                <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-[11px] font-bold text-blue-700">
                  {index + 1}
                </div>

                {/* Avatar with Initials */}
                <div
                  className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr ${member.gradient} text-xl font-bold text-white shadow-md shadow-blue-500/10 transition-transform group-hover:scale-105`}
                >
                  {member.initials}
                </div>

                {/* Name */}
                <h3 className="mt-4 text-base font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                  {member.name}
                </h3>

                {/* Student ID Chip */}
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  <span className="text-[10px] font-semibold text-blue-600">ID:</span>
                  <span className="font-mono tracking-tight font-semibold">{member.id}</span>
                </div>

                {/* Role Pill */}
                <span className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-50/80 px-2.5 py-0.5 rounded-md">
                  Student Contributor
                </span>
              </div>
            ))}
          </div>
        </section>


        {/* ================= 3. MAIN FUNCTION STEPS ================= */}
        <section
          id="how-it-works"
          className="w-full py-12 sm:py-16 scroll-mt-24 border-t border-blue-100/60"
        >
          <div className="mb-10 text-center sm:mb-12">
            <span className="inline-block rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
              MAIN FUNCTION STEPS
            </span>

            <h2 className="mt-3 text-2xl font-extrabold text-[#1E3A8A] sm:text-3xl lg:text-4xl">
              How CampusTrip Works
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
              Follow these simple steps to plan, coordinate, and execute your university trip effortlessly.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
            {/* Step 1 */}
            <div className="relative flex flex-col justify-between rounded-3xl border border-blue-100 bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold text-white shadow-md">
                    1
                  </span>
                  <span className="text-2xl">🗺️</span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-[#1E3A8A]">
                  Step 1: Create or Join
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Set up your trip destination, travel dates, transport mode (Bus, Van, Train, Flight), and starting budget. Invite classmates using a 6-digit join code or QR scan.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => navigate(isAuthenticated ? "/trips/create" : "/login")}
                  className="w-full text-center py-2 px-3 rounded-xl bg-blue-50 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition cursor-pointer"
                >
                  🚀 Try Step 1: Create a Trip →
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col justify-between rounded-3xl border border-blue-100 bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-sm font-bold text-white shadow-md">
                    2
                  </span>
                  <span className="text-2xl">📊</span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-[#1E3A8A]">
                  Step 2: Schedule & Budget
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Build day-by-day itineraries, track expenses in real time, calculate transparent cost splits per student, and manage shared packing checklists.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
                  className="w-full text-center py-2 px-3 rounded-xl bg-indigo-50 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
                >
                  📋 Try Step 2: View Dashboard →
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col justify-between rounded-3xl border border-blue-100 bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-sm font-bold text-white shadow-md">
                    3
                  </span>
                  <span className="text-2xl">💬</span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-[#1E3A8A]">
                  Step 3: Chat & Travel
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Collaborate through real-time group chat discussions, vote on stops with group polls, check live weather forecasts, and stay notified on changes.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => navigate(isAuthenticated ? "/join-trip" : "/login")}
                  className="w-full text-center py-2 px-3 rounded-xl bg-emerald-50 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                >
                  ✨ Try Step 3: Join via Code →
                </button>
              </div>
            </div>
          </div>
        </section>


        {/* ================= 4. CORE FEATURES ================= */}
        <section
          id="features"
          className="w-full py-12 sm:py-16 scroll-mt-24 border-t border-blue-100/60"
        >
          <div className="mb-10 text-center sm:mb-14">
            <span className="inline-block rounded-full bg-blue-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
              FEATURE SUITE
            </span>

            <h2 className="mt-3 text-2xl font-extrabold text-[#1E3A8A] sm:text-3xl lg:text-4xl">
              Everything Students Need For The Road
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
              Engineered specifically for student leaders, classes, and campus clubs.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            <FeatureCard
              icon="🌤"
              title="Weather Forecast"
              description="Live temperature and destination weather condition tracking."
            />

            <FeatureCard
              icon="📅"
              title="Interactive Schedule"
              description="Chronological itinerary with timestamps, locations, and notes."
            />

            <FeatureCard
              icon="💰"
              title="Budget & Splitter"
              description="Log shared transport, food, and stays with automatic per-person splits."
            />

            <FeatureCard
              icon="📋"
              title="Smart Packing List"
              description="Categorized checklist so nobody leaves important essentials behind."
            />
          </div>
        </section>


        {/* ================= 5. ABOUT & VALUE PROPOSITIONS ================= */}
        <section
          id="about"
          className="w-full py-12 sm:py-16 scroll-mt-24 border-t border-blue-100/60"
        >
          <div className="mb-10 text-center sm:mb-14">
            <span className="inline-block rounded-full bg-indigo-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700">
              WHY CHOOSE US
            </span>

            <h2 className="mt-3 text-2xl font-extrabold text-[#1E3A8A] sm:text-3xl lg:text-4xl">
              Built for Campus Life
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
              CampusTrip simplifies trip logistics so everyone can focus on having an unforgettable journey.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            <InfoCard
              icon="🚌"
              title="Easy Planning"
              description="Create trips, destinations and schedules in minutes."
            />

            <InfoCard
              icon="💵"
              title="Budget Tracking"
              description="Keep everyone's expenses organized and transparent."
            />

            <InfoCard
              icon="🗳️"
              title="Voting System"
              description="Let students vote on destinations and activities."
            />

            <InfoCard
              icon="🌦️"
              title="Weather Updates"
              description="Know the weather forecast before you travel."
            />

            <InfoCard
              icon="👥"
              title="Group Management"
              description="Invite classmates and assign trip roles easily."
            />

            <InfoCard
              icon="📱"
              title="Fully Responsive"
              description="Access effortlessly on smartphones, tablets, or desktop PCs."
            />
          </div>
        </section>


        {/* ================= 6. STATS & CTA ================= */}
        <section id="stats" className="w-full py-12 sm:py-16">
          <div className="grid w-full grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            <StatsCard number="500+" label="Students Connected" />
            <StatsCard number="120+" label="Trips Organized" />
            <StatsCard number="99%" label="Trip Success Rate" />
            <StatsCard number="100%" label="Open Collaboration" />
          </div>

          {/* CTA Banner */}
          <div className="mt-12 rounded-3xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-8 sm:p-12 text-center text-white shadow-xl">
            <h3 className="text-2xl sm:text-3xl font-bold">Ready to travel with your classmates?</h3>
            <p className="mt-3 text-blue-100 max-w-xl mx-auto text-sm sm:text-base">
              Create an account in seconds, start your next campus adventure, or join an ongoing trip with your group code.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/register")}
                className="px-6 py-3 rounded-xl bg-white text-blue-800 font-bold hover:bg-blue-50 transition shadow-lg cursor-pointer"
              >
                🚀 Get Started Now
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 rounded-xl border border-white/30 bg-white/10 text-white font-semibold hover:bg-white/20 transition cursor-pointer"
              >
                🔑 Member Sign In
              </button>
            </div>
          </div>
        </section>


        {/* ================= FOOTER ================= */}
        <Footer />

      </main>
    </div>
  );
}

export default Landing;
