import React from "react";
import { Link, useNavigate  } from "react-router-dom";
import "./assets/styles/Home.css"; // Importando el archivo CSS externo
import petConnectLogo from "./assets/images/petConnectLogoNoBG.png";
import step1 from "./assets/images/step1_form.png";
import step2 from "./assets/images/step2_qr_gen.png";

const Home = () => {
  const navigate = useNavigate(); // Hook for navigation


  return (
    <div className="home-container">
      {/* Sección Principal */}
      <section className="hero">
        <div className="hero-content">
          <h1>Conectá mascotas perdidas con sus familias</h1>
          <p>
            Creá fácilmente un código QR para el collar de tu mascota y asegurate de que siempre puedan encontrarla.
          </p>
          {/* <Link to="/login" className="cta-button">
            Empezar Ahora
          </Link> */}
            <button className="cta-button" onClick={() => navigate("/login")}>
            Área Socios
          </button>
        </div>
        <div className="hero-image">
          <img src={petConnectLogo} alt="Código QR para Mascotas" />
        </div>
      </section>

      {/* Sección Cómo Funciona */}
      <section className="how-it-works">
        <h2>¿Cómo Funciona?</h2>
        <div className="steps">
          <div className="step">
            <img src={step1} alt="Paso 1" />
            <h3>Creá un Perfil</h3>
            <p>Agregá los datos de tu mascota y tu información de contacto.</p>
          </div>
          <div className="step">
            <img src={step2} alt="Paso 2" />
            <h3>Generá un Código QR</h3>
            <p>Obtené un código QR que enlaza al perfil de tu mascota.</p>
          </div>
          <div className="step">
          <img src={step1} alt="Paso 3" />
          <h3>Colocalo en el Collar</h3>
            <p>Así, cualquier persona que encuentre a tu mascota podrá contactarte.</p>
          </div>
        </div>
      </section>

      {/* Sección Beneficios */}
      <section className="benefits">
        <h2>¿Por qué usar PetConnect?</h2>
        <ul>
          <li>Contacto instantáneo con quien encuentre a tu mascota</li>
          <li>Perfil personalizado para tu mascota</li>
          <li>No necesitás descargar ninguna app</li>
        </ul>
      </section>

      {/* Llamado a la Acción */}
      <section className="cta-section">
        <h2>Protegé a Tu Mascota Hoy</h2>
        <button className="cta-button" onClick={() => navigate("/login")}>
          Crear Código QR
        </button>      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 PetConnect. Todos los derechos reservados.</p>
        <p>Contacto empresas: <a href="mailto:info@petconnect.com">info@petconnect.com </a></p>
        <p>Teléfono:+54 3795 003578</p>
      </footer>

      
    </div>
  );
};

export default Home;
