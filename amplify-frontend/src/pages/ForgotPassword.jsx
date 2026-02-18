import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Campo obligatorio");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email inválido");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      // Aunque falle, mostramos mensaje neutral por seguridad
      await response.json().catch(() => null);

      setSubmitted(true);

    } catch (err) {
      // Incluso si hay error de red, no revelamos información
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ pointerEvents: "auto", zIndex: 10 }}>
      <div className="auth-card">

        <div className="auth-logo">
          <span className="logo-icon">🎵</span>
        </div>

        <h1 className="auth-title">Restablecer contraseña</h1>

        <p className="auth-subtitle">
          Ingresa tu correo electrónico y te enviaremos un enlace seguro
          para crear una nueva contraseña.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              {error && <p className="form-error">{error}</p>}
            </div>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar enlace"}
            </button>

          </form>
        ) : (
          <div style={{ marginTop: "20px" }}>
            <p
              style={{
                backgroundColor: "#1a1a1a",
                padding: "16px",
                borderRadius: "8px",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              Si el correo está registrado, recibirás un enlace para
              restablecer tu contraseña.
            </p>
          </div>
        )}

        <div className="auth-footer" style={{ marginTop: "24px" }}>
          <Link
            to="/signin"
            style={{
              color: "#8a3ffc",
              textDecoration: "none",
              fontWeight: "600"
            }}
          >
            Volver a iniciar sesión
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
