import { useNavigate } from "react-router-dom";
import "../styles/global.css";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="logo-box">
          <span className="logo-icon">♪</span>
        </div>

        <h1 className="welcome-title">AMPLIFY</h1>
        <p className="welcome-subtitle">Conecta. Crea. Sueña.</p>

        <button
          className="primary-button"
          onClick={() => navigate("/artist/home")}
        >
          Comenzar
        </button>
      </div>
    </div>
  );
}
