import {
  CloudSun,
  CalendarDays,
  Wallet,
  Users,
  MapPin,
} from "lucide-react";

function DashboardPreview() {
  return (
    <div className="relative w-full max-w-lg mx-auto animate-[float_6s_ease-in-out_infinite]">
      {/* Background Glow */}
      <div className="absolute -inset-6 bg-blue-300/30 blur-3xl rounded-full"></div>

      {/* Dashboard */}
      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-[0_25px_60px_rgba(30,58,138,0.15)] p-6 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_35px_80px_rgba(30,58,138,0.22)]">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-gray-500">
              Upcoming Trip
            </p>

            <h2 className="text-2xl font-bold text-[#1E3A8A] mt-1">
              Bangsaen Beach
            </h2>
          </div>

          <div className="bg-blue-100 text-[#1E3A8A] px-4 py-2 rounded-full text-sm font-semibold">
            14 Days
          </div>
        </div>

        {/* Weather */}
        <div className="rounded-2xl bg-gradient-to-r from-sky-100 to-cyan-50 p-5 flex items-center justify-between mb-6 transition duration-300 hover:shadow-md">
          <div>
            <p className="text-gray-500 text-sm">
              Weather
            </p>

            <h3 className="text-4xl font-bold text-[#1E3A8A] mt-1">
              31°C
            </h3>

            <p className="text-gray-600 mt-1">
              Sunny
            </p>
          </div>

          <CloudSun
            size={64}
            className="text-yellow-500"
          />
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-2 gap-4">

          <div className="bg-[#FFF9EF] rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <CalendarDays
              className="text-[#1E3A8A] mb-3"
              size={26}
            />

            <p className="text-gray-500 text-sm">
              Schedule
            </p>

            <h4 className="font-semibold text-lg">
              8 Activities
            </h4>
          </div>

          <div className="bg-[#EFF8FF] rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <Wallet
              className="text-[#1E3A8A] mb-3"
              size={26}
            />

            <p className="text-gray-500 text-sm">
              Budget
            </p>

            <h4 className="font-semibold text-lg">
              $1,250
            </h4>
          </div>

          <div className="bg-[#EFF8FF] rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <Users
              className="text-[#1E3A8A] mb-3"
              size={26}
            />

            <p className="text-gray-500 text-sm">
              Members
            </p>

            <h4 className="font-semibold text-lg">
              24 Students
            </h4>
          </div>

          <div className="bg-[#FFF9EF] rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <MapPin
              className="text-[#1E3A8A] mb-3"
              size={26}
            />

            <p className="text-gray-500 text-sm">
              Destination
            </p>

            <h4 className="font-semibold text-lg">
              Bangsaen
            </h4>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DashboardPreview;