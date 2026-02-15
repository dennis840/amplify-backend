import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login({ name: "Dennis" }); // Simulación de login
    navigate("/dashboard");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        <div className="auth-logo">
          <span className="logo-icon">🎵</span>
        </div>

        <h1 className="auth-title">Bienvenido</h1>
        <p className="auth-subtitle">Inicia sesión para continuar</p>

        <div className="form-group">
          <label className="form-label">Email</label>
          <div className="input-wrapper">
            <span className="input-icon">✉️</span>
            <input
              type="email"
              placeholder="tu@email.com"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Contraseña</label>
          <div className="input-wrapper">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              placeholder="Tu contraseña"
            />
          </div>
        </div>

        <div
          className="auth-footer"
          style={{ textAlign: "right", marginBottom: "20px" }}
        >
          <Link
            to="/forgot-password"
            style={{
              color: "#8a3ffc",
              textDecoration: "none",
              fontWeight: "600"
            }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button
          className="primary-button"
          onClick={handleLogin}
        >
          Entrar
        </button>

        <div className="auth-footer">
          ¿No tienes cuenta? <Link to="/login">Regístrate</Link>
        </div>
      </div>
    </div>
  );
};

export default Signin;
