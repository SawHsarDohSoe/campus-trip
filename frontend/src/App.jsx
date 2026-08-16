import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import StudentDashboard from "./pages/dashboard/Dashboard";

import MyTrips from "./pages/trip/MyTrips";
import CreateTrip from "./pages/trip/CreateTrip";
import TripDetails from "./pages/trip/TripDetails";
import EditTrip from "./pages/trip/EditTrip";
import TripHistory from "./pages/trip/TripHistory";

import Budget from "./pages/budget/Budget";
import Checklist from "./pages/checklist/Checklist";
import Members from "./pages/members/Members";
import Settings from "./pages/settings/Settings";
import Schedule from "./pages/schedule/Schedule";
import JoinTrip from "./pages/join-trip/JoinTrip";

import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================== */}

        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =========================
            PROTECTED ROUTES
        ========================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trips"
          element={
            <ProtectedRoute>
              <MyTrips />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trips/create"
          element={
            <ProtectedRoute>
              <CreateTrip />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trips/:id"
          element={
            <ProtectedRoute>
              <TripDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trips/:id/edit"
          element={
            <ProtectedRoute>
              <EditTrip />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trip-history"
          element={
            <ProtectedRoute>
              <TripHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/join-trip"
          element={
            <ProtectedRoute>
              <JoinTrip />
            </ProtectedRoute>
          }
        />

        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <Schedule />
            </ProtectedRoute>
          }
        />

        <Route
          path="/budget"
          element={
            <ProtectedRoute>
              <Budget />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checklist"
          element={
            <ProtectedRoute>
              <Checklist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/members"
          element={
            <ProtectedRoute>
              <Members />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;