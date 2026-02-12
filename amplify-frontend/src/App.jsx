import { Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signin from "./pages/Signin";
import Terms from "./pages/Terms";
import CreateProfile from "./pages/CreateProfile";

function App() {
  return (
    <Routes>
      {/* Welcome */}
      <Route path="/" element={<Welcome />} />

      {/* Registro */}
      <Route path="/auth" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Inicio de sesión */}
      <Route path="/signin" element={<Signin />} />
      <Route path="/auth/signin" element={<Signin />} />
      <Route path="/auth/login" element={<Signin />} />

      {/* Términos y condiciones */}
      <Route path="/terms" element={<Terms />} />

      {/* Create Profile (después del registro) */}
      <Route path="/create-profile" element={<CreateProfile />} />
    </Routes>
  );
}

export default App;
