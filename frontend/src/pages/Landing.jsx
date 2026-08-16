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
    <div className="min-h-screen bg-gradient-to-b from-[#fffeef] via-[#eff8ff] to-[#ddefff]">
      <BackgroundShapes />

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* ================= HERO ================= */}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24 items-center min-h-[80vh] py-12 lg:py-16">

          {/* Left */}

          <div>

            <p className="uppercase tracking-[0.3em] font-semibold text-blue-600 mb-5">
              PLAN SMARTER. TRAVEL TOGETHER.
            </p>

            <div className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow border border-blue-100 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>

              <span className="text-sm font-medium text-gray-700">
                Trusted by Student Organizations
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-7xl font-bold leading-tight text-[#1E3A8A]">
              Plan Your
              <br />
              Campus Trip
              <br />
              With Ease.
            </h1>

            <p className="mt-6 text-lg text-gray-600 leading-8 max-w-lg lg:max-w-xl">
              CampusTrip helps students organize campus trips with
              schedules, weather forecasts, expense tracking,
              packing checklists, and real-time collaboration —
              all in one modern platform.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start">

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

            <div className="flex flex-wrap gap-6 mt-8 text-sm text-gray-600">

              <span>✅ Free for Students</span>

              <span>🌤 Weather Forecast</span>

              <span>💰 Budget Planner</span>

            </div>

          </div>

          {/* Right */}

          <div className="flex justify-center">
            <DashboardPreview />
          </div>

        </section>

        {/* ================= SPACER ================= */}

        

        {/* ================= STATS ================= */}

        <section id="stats" className="py-16">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

            <StatsCard number="500+" label="Students" />

            <StatsCard number="120" label="Trips Created" />

            <StatsCard number="98%" label="Trip Success" />

            <StatsCard number="15" label="Universities" />

          </div>

        </section>

        {/* ================= SPACER ================= */}

        

        {/* ================= FEATURES ================= */}

        <section id="features" className="py-20">

          <div className="text-center mb-16">

            <p className="uppercase tracking-[0.3em] text-blue-600 font-semibold">
              FEATURES
            </p>

            <h2 className="text-2xl lg:text-4xl font-bold text-[#1E3A8A] mt-4">
              Everything you need for your trip
            </h2>

            <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
              CampusTrip helps students organize, manage and enjoy every trip together.
            </p>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

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

        {/* ================= SPACER ================= */}

        

        {/* ================= WHY CHOOSE US ================= */}

        <section id="about" className="py-20">

          <div className="text-center mb-16">

            <p className="uppercase tracking-[0.3em] text-blue-600 font-semibold">
              WHY CHOOSE US
            </p>

            <h2 className="text-2xl lg:text-4xl font-bold text-[#1E3A8A] mt-4">
              Everything Students Need
            </h2>

            <p className="mt-5 text-gray-600 max-w-2xl mx-auto">
              CampusTrip keeps your entire trip organized from planning
              to arriving back home.
            </p>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

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

        {/* ================= SPACER ================= */}

        

        {/* ================= HOW IT WORKS ================= */}

        <section id="how-it-works" className="pt-16 pb-6">

          <div className="text-center mb-16">

            <p className="uppercase tracking-[0.3em] text-blue-600 font-semibold">
              HOW IT WORKS
            </p>

            <h2 className="text-2xl lg:text-4xl font-bold text-[#1E3A8A] mt-4">
              Plan Your Trip in 3 Easy Steps
            </h2>

          </div>

          <div className="grid md:grid-cols-3 gap-8">

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

        {/* ================= SPACER ================= */}

        

        <Footer />

      </main>

    </div>
  );
}

export default Landing;

