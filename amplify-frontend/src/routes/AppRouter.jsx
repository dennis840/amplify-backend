import { Routes, Route, Navigate } from "react-router-dom";
import ArtistLayout from "../layouts/ArtistLayout";
import ArtistHome from "../pages/ArtistHome";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Welcome from "../pages/Welcome";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />

      <Route path="/artist" element={<ArtistLayout />}>
        <Route path="home" element={<ArtistHome />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

