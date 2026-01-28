import { Routes, Route } from "react-router-dom";
import Welcome from "../pages/Welcome";
import Login from "../pages/Login";
import AuthLayout from "../layouts/AuthLayout";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />

      <Route element={<AuthLayout />}>
        <Route path="/auth" element={<Login />} />
      </Route>
    </Routes>
  );
}