import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Bell } from "lucide-react";
import BrandLogo from "../common/BrandLogo";

export default function MobileHeader({
  title,
  showBack = false,
  backTo,
  onBack,
  rightAction,
  unreadCount = 0,
  className = "",
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    // A child opened by the app has an explicit parent in location state. Pop it
    // normally so the parent is not duplicated in Android/browser history.
    if (location.state?.from && window.history.state?.idx > 0) {
      navigate(-1);
      return;
    }

    // Deep links may not have an in-app parent. Use the declared fallback without
    // creating another entry, rather than sending the user to an unrelated page.
    if (backTo) {
      navigate(backTo, { replace: true });
      return;
    }

    // Keep platform Back behavior when no logical parent was supplied.
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
      return;
    }

    navigate("/dashboard", { replace: true });
  };

  return (
    <header
      className={`shrink-0 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-6 h-14 flex items-center justify-between sticky top-0 z-20 select-none ${className}`}
    >
      {showBack ? (
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            type="button"
            onClick={handleBack}
            className="w-9 h-9 -ml-1.5 rounded-full flex items-center justify-center hover:bg-slate-100 active:bg-slate-200 text-slate-700 transition shrink-0 cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>
          {title && (
            <h1 className="text-base font-bold text-slate-900 truncate">
              {title}
            </h1>
          )}
        </div>
      ) : title ? (
        <div className="flex items-center min-w-0">
          <h1 className="text-lg font-bold text-slate-900 tracking-tight truncate">
            {title}
          </h1>
        </div>
      ) : (
        <Link
          to="/dashboard"
          replace
          className="flex items-center"
          aria-label="Home dashboard"
        >
          <BrandLogo size="sm" />
        </Link>
      )}

      {/* Right Action */}
      <div className="flex items-center gap-2 shrink-0">
        {rightAction ? (
          rightAction
        ) : !showBack ? (
          <Link
            to="/notifications"
            state={{ from: location.pathname }}
            className="relative w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
            )}
          </Link>
        ) : null}
      </div>
    </header>
  );
}
