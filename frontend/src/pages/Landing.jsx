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

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-[#fffeef] via-[#eff8ff] to-[#ddefff]">
      <BackgroundShapes />

      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">

        {/* ================= HERO ================= */}

        <section className="grid w-full grid-cols-1 items-center gap-10 py-10 sm:gap-14 sm:py-12 lg:grid-cols-2 lg:gap-24 lg:py-16">

          {/* Left */}

          <div className="min-w-0">

            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 sm:text-base sm:tracking-[0.3em]">
              PLAN SMARTER. TRAVEL TOGETHER.
            </p>

            <div className="mb-6 hidden items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 shadow lg:inline-flex">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>

              <span className="text-sm font-medium text-gray-700">
                Trusted by Student Organizations
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-tight text-[#1E3A8A] sm:text-5xl xl:text-7xl">
              Plan Your
              <br />
              Campus Trip
              <br />
              With Ease.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              CampusTrip helps students organize campus trips with
              schedules, weather forecasts, expense tracking,
              packing checklists, and real-time collaboration —
              all in one modern platform.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:gap-4">

              <Button onClick={() => navigate("/register")}>
                🚀 Get Started
              </Button>

              <Button
                variant="secondary"
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                📖 Learn More
              </Button>

            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm text-gray-600 sm:gap-6">

              <span>✅ Free for Students</span>

              <span>🌤 Weather Forecast</span>

              <span>💰 Budget Planner</span>

            </div>

          </div>

          {/* Right */}

          <div className="flex w-full min-w-0 justify-center overflow-hidden">

            <div className="w-full min-w-0 max-w-[520px]">

              <DashboardPreview />

            </div>

          </div>

        </section>


        {/* ================= STATS ================= */}

        <section
          id="stats"
          className="w-full py-12 sm:py-16"
        >

          <div className="grid w-full grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">

            <StatsCard
              number="500+"
              label="Students"
            />

            <StatsCard
              number="120"
              label="Trips Created"
            />

            <StatsCard
              number="98%"
              label="Trip Success"
            />

            <StatsCard
              number="15"
              label="Universities"
            />

          </div>

        </section>


        {/* ================= FEATURES ================= */}

        <section
          id="features"
          className="w-full py-14 sm:py-20"
        >

          <div className="mb-12 text-center sm:mb-16">

            <p className="font-semibold uppercase tracking-[0.2em] text-blue-600 sm:tracking-[0.3em]">
              FEATURES
            </p>

            <h2 className="mt-4 text-2xl font-bold leading-tight text-[#1E3A8A] sm:text-3xl lg:text-4xl">
              Everything you need for your trip
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
              CampusTrip helps students organize, manage and enjoy
              every trip together.
            </p>

          </div>

          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">

            <FeatureCard
              icon="🌤"
              title="Weather"
              description="Check destination weather before leaving."
            />

            <FeatureCard
              icon="📅"
              title="Schedule"
              description="Plan every activity with your team."
            />

            <FeatureCard
              icon="💰"
              title="Budget"
              description="Track expenses and split costs fairly."
            />

            <FeatureCard
              icon="📋"
              title="Checklist"
              description="Never forget important travel items."
            />

          </div>

        </section>


        {/* ================= WHY CHOOSE US ================= */}

        <section
          id="about"
          className="w-full py-14 sm:py-20"
        >

          <div className="mb-12 text-center sm:mb-16">

            <p className="font-semibold uppercase tracking-[0.2em] text-blue-600 sm:tracking-[0.3em]">
              WHY CHOOSE US
            </p>

            <h2 className="mt-4 text-2xl font-bold leading-tight text-[#1E3A8A] sm:text-3xl lg:text-4xl">
              Everything Students Need
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
              CampusTrip keeps your entire trip organized from
              planning to arriving back home.
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
              title="Mobile Friendly"
              description="Manage your trip from any device, anywhere."
            />

          </div>

        </section>


        {/* ================= HOW IT WORKS ================= */}

        <section
          id="how-it-works"
          className="w-full pt-12 pb-6 sm:pt-16"
        >

          <div className="mb-12 text-center sm:mb-16">

            <p className="font-semibold uppercase tracking-[0.2em] text-blue-600 sm:tracking-[0.3em]">
              HOW IT WORKS
            </p>

            <h2 className="mt-4 text-2xl font-bold leading-tight text-[#1E3A8A] sm:text-3xl lg:text-4xl">
              Plan Your Trip in 3 Easy Steps
            </h2>

          </div>

          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-8">

            <StepCard
              number="1"
              title="Create a Trip"
              description="Enter your destination, travel date, and invite classmates."
            />

            <StepCard
              number="2"
              title="Manage Everything"
              description="Track schedules, weather, expenses and packing lists."
            />

            <StepCard
              number="3"
              title="Enjoy Your Journey"
              description="Stay connected with your group and enjoy your trip."
            />

          </div>

        </section>


        {/* ================= FOOTER ================= */}

        <Footer />

      </main>

    </div>
  );
}

export default Landing;
