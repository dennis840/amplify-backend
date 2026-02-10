import { Link } from "react-router-dom";

const Signin = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* Logo */}
        <div className="auth-logo">
          <span className="logo-icon">🎵</span>
        </div>

        {/* Títulos */}
        <h1 className="auth-title">Bienvenido</h1>
        <p className="auth-subtitle">Inicia sesión para continuar</p>

        {/* Email */}
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

        {/* Contraseña */}
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

        {/* Olvidaste contraseña */}
        <div className="auth-footer" style={{ textAlign: "right", marginBottom: "20px" }}>
          <a href="#">¿Olvidaste tu contraseña?</a>
        </div>

        {/* Botón */}
        <button className="primary-button">Entrar</button>

        {/* Footer */}
        <div className="auth-footer">
          ¿No tienes cuenta? <Link to="/login">Regístrate</Link>
        </div>
      </div>
    </div>
  );
};

export default Signin;
