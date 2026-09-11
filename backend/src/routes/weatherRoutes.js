import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();
const weatherCache = new Map();
const CACHE_MS = 10 * 60 * 1000;

router.use(requireAuth);

router.get("/", async (request, response) => {
  try {
    const { city, date } = request.query;

    if (!city) {
      return response.status(400).json({
        message: "City is required.",
      });
    }

    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
      return response.status(500).json({
        message: "Weather API key is not configured.",
      });
    }

    const cacheKey = `${city.trim().toLowerCase()}|${date || "current"}`;
    const cached = weatherCache.get(cacheKey);
    if (cached && Date.now() - cached.createdAt < CACHE_MS) {
      return response.json(cached.data);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const requestedDate = date ? new Date(`${date}T00:00:00`) : null;
    const forecastLimit = new Date(today);
    forecastLimit.setDate(forecastLimit.getDate() + 5);

    if (requestedDate && Number.isNaN(requestedDate.getTime())) {
      return response.status(400).json({ message: "A valid trip date is required." });
    }

    if (requestedDate && requestedDate < today) {
      return response.json({
        available: false,
        mode: "forecast",
        requestedDate: date,
        message: "Forecast data is no longer available for this past trip date.",
      });
    }

    if (requestedDate && requestedDate > forecastLimit) {
      return response.json({
        available: false,
        mode: "forecast",
        requestedDate: date,
        message: "Forecast data is not available yet for this trip date. Check again within 5 days of departure.",
      });
    }

    const useForecast = requestedDate && requestedDate > today;
    const endpoint = useForecast ? "forecast" : "weather";
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/${endpoint}?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric`
    );

    const data = await weatherResponse.json();

    if (!weatherResponse.ok) {
      return response.status(weatherResponse.status).json({
        message: data.message || "Unable to get weather.",
      });
    }

    let result;
    if (useForecast) {
      const daily = new Map();
      for (const item of data.list || []) {
        const itemDate = item.dt_txt.slice(0, 10);
        const hour = Number(item.dt_txt.slice(11, 13));
        const existing = daily.get(itemDate);
        if (!existing || Math.abs(hour - 12) < Math.abs(existing.hour - 12)) {
          daily.set(itemDate, {
            date: itemDate,
            hour,
            temperature: item.main.temp,
            feelsLike: item.main.feels_like,
            humidity: item.main.humidity,
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            windSpeed: item.wind.speed,
          });
        }
      }

      const forecast = [...daily.values()].map(({ hour: _hour, ...item }) => item);
      const selected = daily.get(date);
      if (!selected) {
        result = {
          available: false,
          mode: "forecast",
          requestedDate: date,
          message: "Forecast data is not available for this trip date yet.",
        };
      } else {
        const { hour: _hour, ...current } = selected;
        result = {
          available: true,
          mode: "forecast",
          city: data.city.name,
          country: data.city.country,
          requestedDate: date,
          current,
          forecast,
        };
      }
    } else {
      result = {
        available: true,
        mode: "current",
        city: data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        windSpeed: data.wind.speed,
      };
    }

    weatherCache.set(cacheKey, { data: result, createdAt: Date.now() });
    return response.json(result);
  } catch (error) {
    console.error("Weather error:", error);
    return response.status(500).json({
      message: "Unable to retrieve weather information.",
    });
  }
});

export default router;
