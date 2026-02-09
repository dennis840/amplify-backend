import { useNavigate } from "react-router-dom";

export default function Signin() {
  const navigate = useNavigate();

  return (
    <div style={{ color: "white", textAlign: "center" }}>
      <h1>Iniciar sesión</h1>
      <p>Pantalla de inicio de sesión (Signin)</p>

      <button onClick={() => navigate("/login")}>
        Volver a registro
      </button>
    </div>
  );
}
