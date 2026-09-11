import React, { useState, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { QrCode, X, Check } from "lucide-react";
import { Scanner } from "@yudiel/react-qr-scanner";
import MobileShell from "../../components/layout/MobileShell";
import MobileHeader from "../../components/layout/MobileHeader";
import { HighFiveIllustration } from "../../components/common/Illustrations";
import { joinTrip } from "../../api/authApi";

export default function JoinTrip() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const sharedCode = (searchParams.get("code") || "").replace(/\D/g, "").slice(0, 6);
  const [digits, setDigits] = useState(() =>
    Array.from({ length: 6 }, (_, index) => sharedCode[index] || "")
  );
  const inputRefs = useRef([]);
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleDigitChange = (index, value) => {
    if (value.length > 1) {
      // Paste handling
      const clean = value.replace(/\D/g, "").slice(0, 6);
      const newDigits = [...digits];
      clean.split("").forEach((char, i) => {
        newDigits[i] = char;
      });
      setDigits(newDigits);
      const focusIndex = Math.min(clean.length, 5);
      inputRefs.current[focusIndex]?.focus();
      return;
    }

    const char = value.replace(/\D/g, "");
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    // Auto advance
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleJoin = async (codeToUse) => {
    const code = codeToUse || digits.join("");
    if (code.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("campusTripToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await joinTrip(code, token);
      setSuccess(res?.message || "Successfully joined trip!");
      setTimeout(() => navigate("/trips", { replace: true }), 1200);
    } catch (err) {
      setError(err.message || "Invalid or expired join code.");
    } finally {
      setLoading(false);
    }
  };

  const handleScan = (detectedCodes) => {
    if (!detectedCodes?.length || loading) return;
    const scanned = detectedCodes[0]?.rawValue || "";
    const clean = scanned.replace(/\D/g, "").slice(0, 6);
    if (clean.length === 6) {
      const arr = clean.split("");
      setDigits(arr);
      setShowScanner(false);
      handleJoin(clean);
    }
  };

  return (
    <MobileShell showBottomNav={true} contentClassName="bg-white">
      <MobileHeader title="Join Trip" showBack backTo={location.state?.from || "/dashboard"} />

      <div className="px-6 py-5 flex flex-col items-center text-center">
        {/* Illustration */}
        <div className="my-3">
          <HighFiveIllustration className="w-48 h-36" />
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-xl font-bold text-slate-900 mt-1">
          Join a Trip with Code
        </h2>
        <p className="text-xs text-slate-500 mt-2 max-w-[280px]">
          Enter the 6-digit code to join your friend's trip.
        </p>

        {error && (
          <div className="w-full mt-4 rounded-xl bg-red-50 border border-red-200 p-2.5 text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="w-full mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-700 font-medium flex items-center justify-center gap-1.5">
            <Check size={14} />
            <span>{success}</span>
          </div>
        )}

        {/* 6 Square Digits */}
        <div className="flex items-center justify-center gap-2.5 my-6">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-11 h-12 text-center text-lg font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition shadow-sm"
            />
          ))}
        </div>

        {/* Join Trip Button */}
        <button
          onClick={() => handleJoin()}
          disabled={loading || digits.join("").length !== 6}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-500/25 active:scale-[0.99] transition disabled:opacity-50"
        >
          {loading ? "Joining..." : "Join Trip"}
        </button>

        {/* Divider */}
        <div className="w-full flex items-center my-6">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="px-3 text-[11px] text-slate-400 font-medium">
            Or scan QR code
          </span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        {/* Open Scanner Button */}
        <button
          onClick={() => setShowScanner(true)}
          className="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 active:scale-[0.99] transition"
        >
          <QrCode size={16} className="text-blue-600" />
          <span>Open Scanner</span>
        </button>
      </div>

      {/* Camera QR Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Scan Trip QR</h3>
              <button
                onClick={() => setShowScanner(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X size={18} />
              </button>
            </div>
            <div className="w-full aspect-square mt-4 rounded-2xl overflow-hidden bg-black relative flex items-center justify-center">
              <Scanner onScan={handleScan} />
            </div>
            <p className="text-[11px] text-slate-400 text-center mt-3">
              Point your camera at a friend's CampusTrip QR code.
            </p>
          </div>
        </div>
      )}
    </MobileShell>
  );
}
