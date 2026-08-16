import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import checklistRoutes from "./routes/checklistRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import pollRoutes from "./routes/pollRoutes.js";
import discussionRoutes from "./routes/discussionRoutes.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL ?? "http://localhost:5173" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/checklist", checklistRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/discussions", discussionRoutes);

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok", message: "CampusTrip API is running" });
});

app.use((_request, response) => {
  response.status(404).json({ message: "API route not found." });
});

app.use((error, _request, response, _next) => {
  console.error(error);
  if (error.name === "ValidationError") {
    return response.status(400).json({ message: error.message });
  }
  if (error.name === "CastError") {
    return response.status(400).json({ message: "Invalid resource ID." });
  }
  response.status(500).json({ message: "An unexpected server error occurred." });
});

export default app;
