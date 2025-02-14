import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "./slices/authSlice";
import "./assets/styles/Login.css";
import petConnectLogo from "./assets/images/petConnectLogoNoBG.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const savedCredentials = localStorage.getItem("credentials");
    if (savedCredentials) {
      const { email, password } = JSON.parse(savedCredentials);
      setEmail(email);
      setPassword(password);
      dispatch(login());
      navigate("/admin/create");
    }
  }, [dispatch, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://us-central1-baby-gift-project.cloudfunctions.net/login-pet",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Credenciales inválidas. Intentá de nuevo.");
      }

      const data = await response.json();
      localStorage.setItem("credentials", JSON.stringify({ email, password }));
      dispatch(login());
      navigate("/admin/create");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://us-central1-baby-gift-project.cloudfunctions.net/reset-pet",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resetEmail }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al enviar el correo de restablecimiento. Intentá de nuevo.");
      }

      alert(`Correo enviado a ${resetEmail}`);
      setForgotPassword(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="hero-image">
        <img src={petConnectLogo} alt="Código QR para Mascotas" />
      </div>

      <form onSubmit={forgotPassword ? handleForgotPassword : handleLogin} className="login-form">
        <h2>{forgotPassword ? "Recuperar contraseña" : "Iniciar sesión"}</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {forgotPassword ? (
          <div>
            <label>Ingresá tu email para restablecer la contraseña:</label>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviado"}
            </button>
            <button type="button" onClick={() => setForgotPassword(false)}>
            Volver al inicio de sesión
            </button>
          </div>
        ) : (
          <>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Contraseña:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
            <button type="button" onClick={() => setForgotPassword(true)}>
              Recuperar contraseña
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default Login;
