import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileShell from "../../components/layout/MobileShell";
import { RocketBadge } from "../../components/common/BrandLogo";

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem("campusTripToken");
      if (token) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <MobileShell showBottomNav={false} contentClassName="bg-white">
      <div
        onClick={() => navigate("/onboarding")}
        className="flex-1 flex flex-col items-center justify-between py-16 px-6 cursor-pointer select-none"
      >
        <div className="w-full flex justify-end opacity-0">
          <span className="text-sm">Skip</span>
        </div>

        {/* Center Rocket & Brand */}
        <div className="flex flex-col items-center text-center animate-fade-in">
          <div className="mb-6 transform hover:scale-105 transition-transform duration-300">
            <RocketBadge size="xl" className="w-24 h-24 rounded-[32px] shadow-xl shadow-blue-500/30" />
          </div>

          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Campus<span className="text-blue-600">Trip</span>
          </h1>

          <p className="mt-3 text-sm font-medium text-slate-500 tracking-wide">
            Plan Smarter. Travel Together.
          </p>
        </div>

        {/* Bottom Loading Spinner */}
        <div className="flex flex-col items-center pb-8">
          <div className="w-9 h-9 border-3 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    </MobileShell>
  );
}
