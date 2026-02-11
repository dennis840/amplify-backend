import { Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signin from "./pages/Signin";

function App() {
  return (
    <Routes>
      {/* Welcome */}
      <Route path="/" element={<Welcome />} />

      {/* Login / Registro */}
      <Route path="/auth" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Sign in */}
      <Route path="/signin" element={<Signin />} />
      <Route path="/auth/signin" element={<Signin />} />
      <Route path="/auth/login" element={<Signin />} />
    </Routes>
  );
}

export default App;
