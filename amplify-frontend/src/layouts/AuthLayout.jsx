import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7C3AED] to-[#4F46E5]">
      <Outlet />
    </div>
  );
}