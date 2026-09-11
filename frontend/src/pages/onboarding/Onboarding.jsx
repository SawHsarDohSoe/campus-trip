import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MobileShell from "../../components/layout/MobileShell";
import { OnboardingHikerIllustration } from "../../components/common/Illustrations";

const SLIDES = [
  {
    title: "Explore Plan Travel Together",
    description:
      "Join trips, manage budgets, create checklists, and make memories with your friends.",
  },
  {
    title: "Smarter Shared Budgets",
    description:
      "Track group expenses, split costs transparently, and stay on budget effortlessly.",
  },
  {
    title: "Collaborative Schedules",
    description:
      "Organize daily itineraries, vote on group activities, and never miss a landmark.",
  },
  {
    title: "Real-time Group Chat",
    description:
      "Discuss travel plans, coordinate meetups, and share excitement before departure.",
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      navigate("/register");
    }
  };

  return (
    <MobileShell showBottomNav={false} contentClassName="bg-white">
      <div className="flex-1 flex flex-col justify-between p-6">
        {/* Top bar with Skip */}
        <div className="flex justify-end pt-1">
          <Link
            to="/login"
            className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition"
          >
            Skip
          </Link>
        </div>

        {/* Hero Illustration */}
        <div className="flex-1 flex flex-col items-center justify-center my-4">
          <div className="w-56 h-56 flex items-center justify-center">
            <OnboardingHikerIllustration className="w-56 h-56" />
          </div>

          {/* Texts */}
          <div className="text-center mt-8 px-3">
            <h2 className="text-2xl font-bold text-slate-900 leading-tight">
              {SLIDES[currentSlide].title}
            </h2>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed max-w-[320px] mx-auto">
              {SLIDES[currentSlide].description}
            </p>
          </div>

          {/* 4-dots indicator */}
          <div className="flex items-center gap-2 mt-6">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full h-2 ${
                  currentSlide === idx
                    ? "w-6 bg-blue-600"
                    : "w-2 bg-slate-200 hover:bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col items-center gap-3 pb-4">
          <button
            onClick={handleNext}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/25 active:scale-[0.99] transition"
          >
            {currentSlide === SLIDES.length - 1 ? "Get Started" : "Continue"}
          </button>

          <Link
            to="/login"
            className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition py-1"
          >
            Skip
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}
