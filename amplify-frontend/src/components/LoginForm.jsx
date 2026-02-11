import { useState } from "react";
import "../styles/form.css"; // Asegúrate de crear este CSS después

export function LoginForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // Validación de campos
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Nombre obligatorio";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Email inválido";
    if (!form.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/))
      newErrors.password =
        "Password debe tener 8 caracteres, mayúscula, número y símbolo";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords no coinciden";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      console.log("Registro exitoso:", form); // Simulación
      onSuccess(); // función que redirige a crear perfil de músico
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Crear cuenta</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      {errors.name && <p className="error">{errors.name}</p>}

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      {errors.email && <p className="error">{errors.email}</p>}

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      {errors.password && <p className="error">{errors.password}</p>}

      <input
        type="password"
        placeholder="Confirmar Password"
        value={form.confirmPassword}
        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
      />
      {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

      <button type="submit">Registrarme</button>
      <p>
        ¿Ya tienes cuenta? <span className="link">Inicia sesión</span>
      </p>
    </form>
  );
}
