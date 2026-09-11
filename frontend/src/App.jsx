import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 18 Main Screens
import SplashScreen from "./pages/splash/SplashScreen";
import Onboarding from "./pages/onboarding/Onboarding";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Notifications from "./pages/notifications/Notifications";
import MyTrips from "./pages/trip/MyTrips";
import TripDetails from "./pages/trip/TripDetails";
import CreateTrip from "./pages/trip/CreateTrip";
import EditTrip from "./pages/trip/EditTrip";
import JoinTrip from "./pages/join-trip/JoinTrip";
import TripHistory from "./pages/trip/TripHistory";
import Schedule from "./pages/schedule/Schedule";
import Budget from "./pages/budget/Budget";
import Checklist from "./pages/checklist/Checklist";
import Members from "./pages/members/Members";
import Chat from "./pages/chat/Chat";
import Profile from "./pages/profile/Profile";
import Settings from "./pages/settings/Settings";

import Landing from "./pages/Landing";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Desktop / Web Landing Page with Team Members */}
        <Route path="/" element={<Landing />} />
        <Route path="/splash" element={<SplashScreen />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Core App Screens */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notifications" element={<Notifications />} />

        {/* Trips */}
        <Route path="/trips" element={<MyTrips />} />
        <Route path="/trips/create" element={<CreateTrip />} />
        <Route path="/trips/:id" element={<TripDetails />} />
        <Route path="/trips/:id/edit" element={<EditTrip />} />
        <Route path="/trip-history" element={<TripHistory />} />
        <Route path="/join-trip" element={<JoinTrip />} />

        {/* Modules */}
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/checklist" element={<Checklist />} />
        <Route path="/members" element={<Members />} />

        {/* Communication & Account */}
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
