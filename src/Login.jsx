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
        throw new Error("Invalid credentials. Try again.");
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
        throw new Error("Failed to send reset email. Try again.");
      }

      alert(`Reset link sent to ${resetEmail}`);
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
        <h2>{forgotPassword ? "Forgot Password" : "Login"}</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {forgotPassword ? (
          <div>
            <label>Enter your email to reset password:</label>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Submit"}
            </button>
            <button type="button" onClick={() => setForgotPassword(false)}>
              Back to Login
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
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <button type="button" onClick={() => setForgotPassword(true)}>
              Forgot My Password
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default Login;
