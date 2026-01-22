import { Link } from "react-router-dom"

function Login() {
  return (
    <div>
      <h1>Login</h1>
      <p>Pantalla de inicio de sesión</p>
      <Link to="/dashboard">
        <button>Entrar</button>
      </Link>
    </div>
  )
}

export default Login
