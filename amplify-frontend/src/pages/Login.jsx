import { Music } from "lucide-react";
import "../styles/login.css";

export default function Login() {
  return (
    <div className="login-wrapper">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <Music size={28} color="#ffffff" />
        </div>

        {/* Títulos */}
        <h1 className="login-title">Crear cuenta</h1>
        <p className="login-subtitle">
          Únete a la comunidad de músicos
        </p>

        {/* Formulario */}
        <form className="login-form">
          <label>
            Nombre
            <input
              type="text"
              placeholder="Tu nombre artístico"
            />
          </label>

          <label>
            Correo electrónico
            <input
              type="email"
              placeholder="tu@email.com"
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              placeholder="Mínimo 8 caracteres"
            />
          </label>

          <label>
            Confirmar contraseña
            <input
              type="password"
              placeholder="Repite tu contraseña"
            />
          </label>

          <div className="login-terms">
            <input type="checkbox" />
            <span>Acepto los términos y condiciones</span>
          </div>

          <button type="submit">Registrarme</button>
        </form>

        {/* Footer */}
        <p className="login-footer">
          ¿Ya tienes cuenta? <span>Inicia sesión</span>
        </p>
      </div>
    </div>
  );
}
