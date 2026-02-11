import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div
      className="auth-container"
      style={{ pointerEvents: "auto", zIndex: 10 }}
    >
      <div className="auth-card">

        {/* LOGO */}
        <div className="auth-logo">
          <span className="logo-icon">🎵</span>
        </div>

        {/* TITULOS */}
        <h1 className="auth-title">Crear cuenta</h1>
        <p className="auth-subtitle">
          Únete a la comunidad de músicos
        </p>

        {/* FORMULARIO */}
        <form>
          <div className="form-group">
            <label className="form-label">Nombre artístico</label>
            <div className="input-wrapper">
              <span className="input-icon">🎤</span>
              <input type="text" placeholder="Tu nombre artístico" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input type="email" placeholder="correo@ejemplo.com" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input type="password" placeholder="••••••••" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar contraseña</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input type="password" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" className="primary-button">
            Registrarme
          </button>
        </form>

        {/* FOOTER */}
        <div className="auth-footer">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/signin"
            style={{
              color: "#8a3ffc",
              cursor: "pointer",
              textDecoration: "none",
              fontWeight: "600"
            }}
          >
            Inicia sesión
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
