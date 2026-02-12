import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Campo obligatorio";
    }

    if (!formData.email) {
      newErrors.email = "Campo obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.password) {
      newErrors.password = "Campo obligatorio";
    } else {
      const password = formData.password;

      const hasMinLength = password.length >= 8;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (!hasMinLength || !hasUpperCase || !hasNumber || !hasSpecialChar) {
        newErrors.password =
          "Mín. 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial";
      }
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (!formData.terms) {
      newErrors.terms = "Debes aceptar los términos y condiciones";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            terms: formData.terms,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al registrar usuario");
      }

      // 🔐 Guardar token
      localStorage.setItem("token", data.token);

      // 🚀 Redirigir a create-profile
      navigate("/create-profile");

    } catch (error) {
      setErrors({ server: error.message });
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

        <h1 className="auth-title">Crear cuenta</h1>
        <p className="auth-subtitle">
          Únete a la comunidad de músicos
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label className="form-label">Nombre artístico</label>
            <div className="input-wrapper">
              <span className="input-icon">🎤</span>
              <input
                type="text"
                name="name"
                placeholder="Tu nombre artístico"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                type="email"
                name="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              <span
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁"}
              </span>
            </div>
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar contraseña</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <span
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? "🙈" : "👁"}
              </span>
            </div>
            {errors.confirmPassword && (
              <p className="form-error">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
              />
              Acepto los{" "}
              <Link to="/terms" style={{ color: "#8a3ffc", fontWeight: "600" }}>
                términos y condiciones
              </Link>
            </label>
            {errors.terms && <p className="form-error">{errors.terms}</p>}
          </div>

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Registrando..." : "Registrarme"}
          </button>

          {errors.server && (
            <p className="form-error">{errors.server}</p>
          )}

        </form>

        <div className="auth-footer">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/signin"
            style={{
              color: "#8a3ffc",
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
