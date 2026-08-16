import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/db.js";

const port = process.env.PORT ?? 5000;

async function startServer() {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`CampusTrip API listening on port ${port}`);
    });
  } catch (error) {
    console.error("Unable to start CampusTrip API:", error.message);
    process.exit(1);
  }
}

startServer();
