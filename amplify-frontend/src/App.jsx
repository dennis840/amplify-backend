import { Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signin from "./pages/Signin";
import Terms from "./pages/Terms";
import CreateProfile from "./pages/CreateProfile";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />

      <Route path="/auth" element={<Login />} />
      <Route path="/login" element={<Login />} />

      <Route path="/signin" element={<Signin />} />
      <Route path="/auth/signin" element={<Signin />} />
      <Route path="/auth/login" element={<Signin />} />

      {/* ESTA ES LA QUE FALTABA */}
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/terms" element={<Terms />} />
      <Route path="/create-profile" element={<CreateProfile />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
