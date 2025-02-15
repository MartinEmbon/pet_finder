import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "./Components/Header/Header";
// import "../src/assets/styles/AlbumNotFound.css";
import { Helmet } from "react-helmet";

function PetNotFound() {
  const albumNotFoundTranlations = {
    pt: {
      title: "Ops... Este álbum não existe!",
      helmetTitle:"Álbum não Encontrado",
      content:
        "O álbum que você está procurando não existe ou não está mais disponível.",
        goHome: "Ir para a Home",
    },
    es: {
      title: "¡Ups... Este álbum no existe!",
      content: "El álbum que estás buscando no existe o ya no está disponible.",
      goHome: "Ir para Home",
      helmetTitle:"Álbum no encontrado",
    },
    en: {
      title: "Oops... This album does not exist!",
      content: "The album you are looking for does not exist or is no longer available.",
      goHome: "Go to Home",
      helmetTitle:"Album not Found"
    }
  };

  const lang = navigator.language.split("-")[0]; // Get the language code (e.g., 'es', 'pt')

  const content = albumNotFoundTranlations[lang]
    ? albumNotFoundTranlations[lang]
    : albumNotFoundTranlations["en"]; // Fallback to 'en'

  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate("/"); // Navigate to the previous page in the history stack
  };
  return (
    <div className="album-not-found">
      <Helmet>
        <title>Mascota no encontrada</title>
      </Helmet>
      <Link to="/">
        <Header />
      </Link>
      <h1>¡Ups... Esta mascota no existe!</h1>
      <p>La mascota que estás buscando no existe o ya no está disponible en el registro</p>
      <button onClick={handleGoBack}>Ir para Home</button>
    </div>
  );
}

export default PetNotFound;
