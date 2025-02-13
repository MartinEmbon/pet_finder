import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "./slices/authSlice"; // Import the login action
import "./assets/styles/Login.css";
import petConnectLogo from "./assets/images/petConnectLogoNoBG.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false); // State for forgot password
  const [resetEmail, setResetEmail] = useState(""); // State for reset email
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mockUser = {
    email: "admin@example.com",
    password: "password123",
  };

  // Check if the user is already logged in by checking localStorage
  useEffect(() => {
    const savedCredentials = localStorage.getItem("credentials");
    if (savedCredentials) {
      const { email, password } = JSON.parse(savedCredentials);
      setEmail(email);
      setPassword(password);
      dispatch(login()); // Dispatch login if credentials are found
      navigate("/admin/create"); // Redirect to dashboard
    }
  }, [dispatch, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === mockUser.email && password === mockUser.password) {
      const credentials = { email, password };
      localStorage.setItem("credentials", JSON.stringify(credentials)); // Save credentials in localStorage
      dispatch(login()); // Dispatch login action
      navigate("/admin/create"); // Redirect after successful login
    } else {
      alert("Invalid credentials. Try again.");
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert(`Next step: Reset link sent to ${resetEmail}`);
    // Here you could implement API call to send a reset link
    setForgotPassword(false); // Hide forgot password form after submission
  };

  return (
    <div className="login-container">
      <div className="hero-image">
        <img src={petConnectLogo} alt="Código QR para Mascotas" />
      </div>

      <form onSubmit={forgotPassword ? handleForgotPassword : handleLogin} className="login-form">
        <h2>{forgotPassword ? "Forgot Password" : "Login"}</h2>

        {forgotPassword ? (
          // Forgot Password Form
          <div>
            <label>Enter your email to reset password:</label>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
            <button type="submit">Submit</button>
            <button type="button" onClick={() => setForgotPassword(false)}>Back to Login</button>
          </div>
        ) : (
          // Login Form
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
            <button type="submit">Login</button>
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
