import React from "react";
import {
  AlertCircle,
  CalendarDays,
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  Sun,
  Wind,
} from "lucide-react";

function WeatherIcon({ description = "", className = "" }) {
  const value = description.toLowerCase();
  if (value.includes("rain") || value.includes("drizzle") || value.includes("storm")) {
    return <CloudRain className={className} aria-hidden="true" />;
  }
  if (value.includes("cloud")) {
    return <Cloud className={className} aria-hidden="true" />;
  }
  if (value.includes("clear") || value.includes("sun")) {
    return <Sun className={className} aria-hidden="true" />;
  }
  return <CloudSun className={className} aria-hidden="true" />;
}

export default function WeatherCard({
  data,
  error,
  loading,
  title = "Destination weather",
  compact = false,
}) {
  const current = data?.current || data;
  const forecast = data?.forecast || [];

  return (
    <section
      className={`overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-blue-50 shadow-sm ${
        compact ? "p-4" : "p-4 sm:p-5"
      }`}
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-600">
            Weather
          </p>
          <h2 className="mt-0.5 text-sm font-bold text-slate-900">{title}</h2>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
          <CloudSun size={20} />
        </div>
      </div>

      {loading ? (
        <div className="mt-4 space-y-2" role="status">
          <div className="h-8 w-28 animate-pulse rounded-lg bg-sky-100" />
          <div className="h-3 w-48 max-w-full animate-pulse rounded bg-slate-100" />
          <span className="sr-only">Loading weather</span>
        </div>
      ) : error ? (
        <div className="mt-4 flex items-start gap-2 rounded-2xl bg-white/80 p-3 text-xs text-slate-600">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-500" />
          <span>{error}</span>
        </div>
      ) : data?.available === false ? (
        <div className="mt-4 flex items-start gap-2 rounded-2xl bg-white/80 p-3 text-xs text-slate-600">
          <CalendarDays size={16} className="mt-0.5 shrink-0 text-sky-600" />
          <span>{data.message}</span>
        </div>
      ) : data ? (
        <>
          <div className="mt-4 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <WeatherIcon
                  description={current.description}
                  className="h-8 w-8 shrink-0 text-amber-500"
                />
                <span className="text-3xl font-black tracking-tight text-slate-900">
                  {Math.round(current.temperature)}°
                </span>
              </div>
              <p className="mt-1 truncate text-xs font-semibold capitalize text-slate-700">
                {current.description}
              </p>
              <p className="truncate text-[11px] text-slate-500">
                {data.city || current.city}
                {(data.country || current.country) ? `, ${data.country || current.country}` : ""}
              </p>
            </div>
            <div className="space-y-1 text-right text-[11px] text-slate-500">
              {current.humidity != null && (
                <p className="flex items-center justify-end gap-1">
                  <Droplets size={12} /> {current.humidity}% humidity
                </p>
              )}
              {current.windSpeed != null && (
                <p className="flex items-center justify-end gap-1">
                  <Wind size={12} /> {current.windSpeed} m/s
                </p>
              )}
            </div>
          </div>

          {forecast.length > 0 && (
            <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
              {forecast.map((day) => (
                <div
                  key={day.date}
                  className="min-w-[86px] flex-1 rounded-2xl border border-white bg-white/80 p-2.5 text-center shadow-xs"
                >
                  <p className="text-[10px] font-semibold text-slate-500">
                    {new Date(`${day.date}T12:00:00`).toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "numeric",
                    })}
                  </p>
                  <WeatherIcon
                    description={day.description}
                    className="mx-auto my-1 h-5 w-5 text-sky-600"
                  />
                  <p className="text-xs font-bold text-slate-800">
                    {Math.round(day.temperature)}°
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      ) : null}
    </section>
  );
}
