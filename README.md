# CampusTrip deployment guide

CampusTrip consists of two services:

- `frontend`: React/Vite client
- `backend`: Express API with MongoDB

## Before deployment

1. Create a production MongoDB database (MongoDB Atlas is suitable).
2. Deploy `backend` as a Node service (for example, Render). Use `backend` as the service root, `npm ci` as the build command, and `npm start` as the start command. Set these environment variables:

   ```text
   PORT=5000
   MONGODB_URI=<your production MongoDB connection string>
   JWT_SECRET=<a long random secret>
   JWT_EXPIRES_IN=7d
   CLIENT_URL=https://<your-frontend-domain>
   WEATHER_API_KEY=<your WeatherAPI key>
   ```

   `WEATHER_API_KEY` is required only for the weather feature.

3. Deploy `frontend` as a Vite static site (for example, Vercel). Use `frontend` as the project root and set:

   ```text
   Build command: npm run build
   Publish directory: dist
   VITE_API_URL=https://<your-backend-domain>/api
   ```

4. Update the backend `CLIENT_URL` with the final frontend address, then redeploy the backend. This enables browser requests through CORS. `frontend/vercel.json` makes direct links to application pages work on Vercel.

## Verification

After deployment, open `https://<your-backend-domain>/api/health`. It should return a JSON response with `status: "ok"`. Then register an account and test creating and joining a trip.

Do not commit real `.env` files or database credentials.
