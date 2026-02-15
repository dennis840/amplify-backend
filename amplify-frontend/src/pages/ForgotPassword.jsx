import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Campo obligatorio");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email inválido");
      return;
    }

    setError("");
    setLoading(true);

    // 🚀 Aquí irá la llamada al backend luego
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1000);
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
