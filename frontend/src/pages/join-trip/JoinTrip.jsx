import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

import {
  ArrowRight,
  CheckCircle2,
  KeyRound,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import { joinTrip } from "../../api/authApi";

function JoinTrip() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [trip, setTrip] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showScanner, setShowScanner] = useState(false);

  const handleCodeChange = (event) => {
    const value = event.target.value
      .replace(/\D/g, "")
      .slice(0, 6);

    setCode(value);
    setError("");
    setSuccess("");
  };

  const handleJoin = async (joinCode) => {
    if (!joinCode || joinCode.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("campusTripToken");

      if (!token) {
        navigate("/login");
        return;
      }

      const data = await joinTrip(joinCode, token);

      setTrip(data.trip);
      setSuccess(data.message);
      setCode("");
      setShowScanner(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = (detectedCodes) => {
    if (!detectedCodes?.length || loading) return;

    const scannedValue = detectedCodes[0]?.rawValue;

    if (!scannedValue) return;

    try {
      const url = new URL(scannedValue);
      const scannedCode = url.searchParams.get("code");

      if (scannedCode && /^\d{6}$/.test(scannedCode)) {
        setCode(scannedCode);
        setShowScanner(false);
        setError("");

        handleJoin(scannedCode);
      }
    } catch {
      if (/^\d{6}$/.test(scannedValue)) {
        setCode(scannedValue);
        setShowScanner(false);
        setError("");

        handleJoin(scannedValue);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await handleJoin(code);
  };



  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex flex-1 items-center justify-center p-6 pt-20 md:p-10">

        <section className="w-full max-w-lg">

          {/* Header */}
          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E5F6FD] text-[#1E3A8A]">
              <KeyRound size={30} />
            </div>

            <p className="mt-6 text-sm font-semibold text-blue-700">
              CAMPUS TRIP
            </p>

            <h1 className="mt-1 text-3xl font-bold text-[#1E3A8A]">
              Join a Trip
            </h1>

            <p className="mx-auto mt-3 max-w-md text-gray-500">
              Enter the 6-digit code shared by your trip leader.
            </p>

          </div>

          {/* Card */}
          <div className="mt-8 rounded-3xl bg-white p-7 shadow-xl md:p-9">

            {!success ? (
              <form onSubmit={handleSubmit}>

                <label
                  htmlFor="joinCode"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Trip Join Code
                </label>

                <input
                  id="joinCode"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={6}
                  value={code}
                  onChange={handleCodeChange}
                  placeholder="000000"
                  className="mt-3 w-full rounded-2xl border-2 border-gray-200 px-4 py-5 text-center text-3xl font-bold tracking-[0.5em] text-[#1E3A8A] outline-none transition placeholder:text-gray-300 focus:border-[#1E3A8A]"
                />

                <p className="mt-3 text-center text-xs text-gray-400">
                  {code.length} / 6 digits
                </p>

                {error && (
                  <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}
                <div className="my-6 flex items-center gap-3">
  <div className="h-px flex-1 bg-gray-200" />
  <span className="text-sm text-gray-400">OR</span>
  <div className="h-px flex-1 bg-gray-200" />
</div>

<button
  type="button"
  onClick={() => {
    setShowScanner(true);
    setError("");
  }}
  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#1E3A8A] px-5 py-4 font-semibold text-[#1E3A8A] transition hover:bg-blue-50"
>
  📷 Scan QR Code
</button>
                <button
                  type="submit"
                  disabled={
                    loading || code.length !== 6
                  }
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {loading
                    ? "Joining..."
                    : "Join Trip"}

                  {!loading && (
                    <ArrowRight size={19} />
                  )}
                </button>

              </form>
            ) : (
              <div className="text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle2 size={34} />
                </div>

                <h2 className="mt-5 text-2xl font-bold text-gray-800">
                  Successfully Joined!
                </h2>

                <p className="mt-2 text-gray-500">
                  {success}
                </p>

                {trip && (
                  <div className="mt-6 rounded-2xl bg-[#E5F6FD] p-5 text-left">

                    <h3 className="text-lg font-bold text-[#1E3A8A]">
                      {trip.title}
                    </h3>

                    <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={16} />
                      {trip.destination}
                    </p>

                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    navigate("/trips")
                  }
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-4 font-semibold text-white hover:bg-blue-700"
                >
                  View My Trips
                  <ArrowRight size={19} />
                </button>

              </div>
            )}

          </div>

          {/* QR placeholder */}
          <div className="mt-5 text-center">

            <p className="text-sm text-gray-400">
              Don't have a code?
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Ask your trip leader to share the trip's
              6-digit code.
            </p>

          </div>
            {showScanner && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">

    <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">

      {/* Scanner Header */}
      <div className="flex items-center justify-between p-5">

        <div>
          <h2 className="text-xl font-bold text-[#1E3A8A]">
            Scan QR Code
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Point your camera at the trip QR code.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowScanner(false)}
          className="rounded-xl px-3 py-2 text-gray-500 hover:bg-gray-100"
        >
          ✕
        </button>

      </div>

      {/* Camera */}
      <div className="overflow-hidden bg-black">
        <Scanner
          onScan={handleScan}
          onError={(error) => {
            console.error("QR scanner error:", error);
            setError(
              "Unable to access the camera. Please allow camera permission."
            );
          }}
          constraints={{
            facingMode: "environment",
          }}
          formats={["qr_code"]}
          components={{
            finder: true,
          }}
        />
      </div>

      {/* Scanner Footer */}
      <div className="p-5">

        <p className="text-center text-sm text-gray-500">
          Point your camera at the QR code.
        </p>

        <button
          type="button"
          onClick={() => setShowScanner(false)}
          className="mt-4 w-full rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

      </div>

    </div>

  </div>
)}
        </section>

      </main>
    </div>
  );
}

export default JoinTrip;