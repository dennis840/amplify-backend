import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";

export default function LoginPage() {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate("/create-profile");
  };

  return <LoginForm onSuccess={goToProfile} />;
}
