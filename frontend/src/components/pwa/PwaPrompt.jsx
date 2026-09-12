import { useEffect, useMemo, useState } from "react";
import { Download, RefreshCw, Share, X } from "lucide-react";
import { useRegisterSW } from "virtual:pwa-register/react";

const INSTALL_DISMISSED_AT = "campusTripPwaInstallDismissedAt";
const INSTALL_REMINDER_DELAY = 7 * 24 * 60 * 60 * 1000;

function isRunningStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

export default function PwaPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(isRunningStandalone);
  const [installDismissed, setInstallDismissed] = useState(() => {
    const dismissedAt = Number(localStorage.getItem(INSTALL_DISMISSED_AT));
    return Boolean(dismissedAt && Date.now() - dismissedAt < INSTALL_REMINDER_DELAY);
  });

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({ immediate: true });

  const isIos = useMemo(
    () => /iphone|ipad|ipod/i.test(window.navigator.userAgent),
    [],
  );

  useEffect(() => {
    const handleInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
      localStorage.removeItem(INSTALL_DISMISSED_AT);
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const showInstall = !installed && !installDismissed && Boolean(installPrompt);
  const showIosInstructions = !installed && !installDismissed && isIos;

  if (!needRefresh && !offlineReady && !showInstall && !showIosInstructions) {
    return null;
  }

  const dismiss = () => {
    if (needRefresh) {
      setNeedRefresh(false);
      return;
    }

    if (offlineReady) {
      setOfflineReady(false);
      return;
    }

    localStorage.setItem(INSTALL_DISMISSED_AT, String(Date.now()));
    setInstallDismissed(true);
  };

  const install = async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setInstallPrompt(null);

    if (choice.outcome !== "accepted") {
      localStorage.setItem(INSTALL_DISMISSED_AT, String(Date.now()));
      setInstallDismissed(true);
    }
  };

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed inset-x-3 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-[200] mx-auto max-w-md rounded-2xl border border-blue-100 bg-white p-4 shadow-2xl shadow-slate-900/20 md:inset-x-auto md:bottom-6 md:right-6 md:w-[25rem]"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss PWA message"
        className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
      >
        <X size={18} />
      </button>

      <div className="flex items-start gap-3 pr-8">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/25">
          {needRefresh ? (
            <RefreshCw size={21} />
          ) : showIosInstructions ? (
            <Share size={21} />
          ) : (
            <Download size={21} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900">
            {needRefresh
              ? "CampusTrip update available"
              : offlineReady
                ? "CampusTrip is ready offline"
                : "Install CampusTrip"}
          </p>
          <p className="mt-1 text-sm leading-5 text-slate-600">
            {needRefresh
              ? "Refresh now to use the latest version."
              : offlineReady
                ? "The app shell is cached and can open without a connection."
                : showIosInstructions
                  ? "Tap Share, then choose Add to Home Screen."
                  : "Add the app to your device for a full-screen experience."}
          </p>
        </div>
      </div>

      {(needRefresh || showInstall) && (
        <button
          type="button"
          onClick={needRefresh ? () => updateServiceWorker(true) : install}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800"
        >
          {needRefresh ? <RefreshCw size={17} /> : <Download size={17} />}
          {needRefresh ? "Update now" : "Install app"}
        </button>
      )}
    </aside>
  );
}
