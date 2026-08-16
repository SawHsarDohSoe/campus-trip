import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.use(requireAuth);

router.get("/", async (request, response) => {
  try {
    const { city } = request.query;

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

    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric`
    );

    const data = await weatherResponse.json();

    if (!weatherResponse.ok) {
      return response.status(weatherResponse.status).json({
        message: data.message || "Unable to get weather.",
      });
    }

    return response.json({
      city: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      windSpeed: data.wind.speed,
    });
  } catch (error) {
    console.error("Weather error:", error);
    return response.status(500).json({
      message: "Unable to retrieve weather information.",
    });
  }
});

export default router;