import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "./Components/Header/Header";
import { API_LIST_PET } from "./endpoints";
import { translationsAlbumPage } from "./albumPageTranslation";

import "./assets/styles/PetPage.css"
import { prefetchDNS } from "react-dom";

function Pet() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const petId = queryParams.get("petId");
  const [showOwnerInfo, setShowOwnerInfo] = useState(false);

  const [isGeneralInfoVisible, setIsGeneralInfoVisible] = useState(true);
  const [isOwnerInfoVisible, setIsOwnerInfoVisible] = useState(true);
  const [isVetInfoVisible, setIsVetInfoVisible] = useState(true);


  const [petInfo, setPetInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingEventDetails, setIsLoadingEventDetails] = useState(true); // Loading state for event details
  const lang = navigator.language.split("-")[0]; // Get the language code (es or pt)

  const content = translationsAlbumPage[lang]
    ? translationsAlbumPage[lang]
    : translationsAlbumPage["en"]; // Fallback to 'en'

  const calculateAge = (dateBirth) => {
    if (!dateBirth) return "Desconocida"; // Handle missing data

    const birthDate = new Date(dateBirth);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if the birth date hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age === 0) return "Menos de un año";
    if (age === 1) return "1 año";
    return `${age} años`; // Plural case
  };
  // Check petId immediately and navigate if invalid
  useEffect(() => {
    if (!petId) {
      navigate("/"); // Redirect to home if petId is missing
    }
  }, [petId, navigate]);

  // Fetch pet details
  const fetchPetDetails = useCallback(async () => {
    try {
      const response = await axios.get(`${API_LIST_PET}`, {
        params: { petId },
      });

      console.log(response.data.contactName);
      console.log(response.data.contactPhone);

      if (response.status === 404) {
        navigate("/pet/pet-not-found");
        return;
      }

      const {
        coverImageUrl,
        customMessage,
        petName,
        sterilized,
        petType,
        description,
        location,
        contactPhone,
        contactName,
        petBreed,
        petCharacter,
        microChip,
        microChipNumber,
        dateBirth,
        petColor,
        vetName,
        vetPhone,
        vetAddress

      } = response.data;

      // Check if contactInfo exists and extract contactName and contactPhone

      setPetInfo({
        coverImageUrl,
        customMessage,
        sterilized,
        petName,
        petType,
        description,
        location,
        contactPhone,
        contactName,
        petBreed,
        petCharacter,
        microChip,
        microChipNumber,
        dateBirth,
        petColor,
        vetName,
        vetPhone,
        vetAddress
      });
      console.log(response.data);
      setLoading(false);
      setIsLoadingEventDetails(false);
    } catch (error) {
      setLoading(false);
      setIsLoadingEventDetails(false);
      setErrorMessage("Failed to fetch pet details");
      console.error("Error fetching pet details:", error);
      if (error.response && error.response.status === 404) {
        navigate("/pet/pet-not-found");
      }
    }
  }, [petId, navigate]);

  // Initial fetch for pet details
  useEffect(() => {
    if (petId) {
      fetchPetDetails(); // Fetch pet details only if petId exists
    }
  }, [petId, fetchPetDetails]);

  if (loading || isLoadingEventDetails) {
    return (
      <div className="loading-container">
        <div className="loader-spinner"></div>
        <p className="loading-text">Cargando</p>
        {/* <p className="loading-text">{content.loading}</p> */}

      </div>
    );
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <div>
      <Helmet>
        <title>{showOwnerInfo ? `Contacto de ${petInfo.petName}` : `Perfil de ${petInfo.petName}`}</title>
      </Helmet>
      <Header />

      <div className="pet-card">
        {/* ✅ Pet Image & Name Always Visible */}
        <div className="info">
          <img src={petInfo.coverImageUrl} alt={petInfo.petName} />
        
          {/* ✅ Toggle Between Pet Details & Owner Info */}
          {!showOwnerInfo ? (
            <>
              <div className="pet-info">
                <h1>¡Hola! soy {petInfo.petName}</h1>
                <h3 className="subtitle">Tengo {calculateAge(petInfo.dateBirth)}</h3>
              </div>

              
              <div className="contact-card info">
                <p> {petInfo.customMessage}</p>

              </div>
              <p className="pet-type"><strong>Mascota:</strong> {petInfo.petType}</p>
              <p className="pet-type"><strong>Raza:</strong> {petInfo.petBreed}</p>
              <p className="pet-type"><strong>Mascota:</strong> {petInfo.petCharacter}</p>

              {/* <p><strong>¿Dónde vivo?:</strong> {petInfo.location}    <a 
          href={`https://www.google.com/maps?q=${encodeURIComponent(petInfo.location)}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="maps-link"
        >
          <i className="fas fa-map-marker-alt"></i>
        </a></p>  */}


              {/* Google Maps Link with FontAwesome Icon */}

              <button className="next-button" onClick={() => setShowOwnerInfo(true)}>
                Ver mi perfil completo →
              </button>
            </>
          ) : (
            <>

              {/* Microchip Section */}
              {/* <div className="contact-card info"> */}

              <div className="info">
                <h1 style={{ marginBottom: "10px" }}>Si me ves, ¡avisale a mis papás!</h1>
                {/* Owner Info Section */}
                <div className="collapsible-section">
                  <div
                    className="section-header subcategory"
                    onClick={() => setIsOwnerInfoVisible(!isOwnerInfoVisible)}
                  >
                    <strong>Contacto de mis dueños</strong>
                    <span className={`arrow ${isOwnerInfoVisible ? 'up' : 'down'}`}>&#x2191;</span>
                  </div>
                  {isOwnerInfoVisible && (
                    <div className="section-content">
                      <p><strong>Nombre:</strong> {petInfo.contactName}</p>
                      <p><strong>Teléfono: </strong>
                        <span className="phone-with-whatsapp">
                          {petInfo.contactPhone}
                          <a
                            target="_blank"
                            href={`https://wa.me/54${petInfo.contactPhone}`}
                            className="whatsapp-link"
                            rel="noreferrer"
                          >
                            <i className="fab fa-whatsapp"></i>
                          </a>
                        </span>
                      </p>
                      <p><strong>¿Dónde vivo?:</strong> {petInfo.location}    <a
                        href={`https://www.google.com/maps?q=${encodeURIComponent(petInfo.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="maps-link"
                      >
                        <i className="fas fa-map-marker-alt"></i>
                      </a></p>



                    </div>
                  )}
                </div>
                {/* General Info Section */}
                <div className="collapsible-section">
                  <div
                    className="section-header"

                    onClick={() => setIsGeneralInfoVisible(!isGeneralInfoVisible)}
                  >
                    <strong>Sobre mi</strong>
                    <span
                      className={`arrow ${isGeneralInfoVisible ? "up" : "down"}`}
                      style={{ color: "inherit" }}  // Ensure arrow color follows the inherited color
                    >
                      &#x2191;
                    </span>
                  </div>
                  {isGeneralInfoVisible && (
                    <div className="section-content">
                      <p className="pet-type"><strong>Mascota:</strong> {petInfo.petType}</p>
                      <p className="pet-type"><strong>Raza:</strong> {petInfo.petBreed}</p>
                      <p className="pet-type"><strong>Edad:</strong> {calculateAge(petInfo.dateBirth)}</p>
                      <p className="pet-type"><strong>Color:</strong> {petInfo.petColor}</p>
                      <p className="pet-type"><strong>Carácter:</strong> {petInfo.petCharacter}</p>
                      <p className="pet-type"><strong>Esterilización:</strong> {petInfo.sterilized}</p>
                      <p><strong>Microchip:</strong> {petInfo?.microChip}</p>
                      {petInfo?.microChip?.toLowerCase() === "yes" && petInfo?.microChipNumber && (
                        <p><strong>Microchip #:</strong> {petInfo.microChipNumber}</p>

                      )}

                    </div>
                  )}
                </div>

                <div className="collapsible-section">
                  <div
                    className="section-header"

                    onClick={() => setIsVetInfoVisible(!isVetInfoVisible)}
                  >
                    <strong>Mi veterinario</strong>
                    <span
                      className={`arrow ${isVetInfoVisible ? "up" : "down"}`}
                      style={{ color: "inherit" }}  // Ensure arrow color follows the inherited color
                    >
                      &#x2191;
                    </span>
                  </div>
                  {isVetInfoVisible && (
                    <div className="section-content">
                      <p className="pet-type"><strong>Nombre:</strong> {petInfo.vetName}</p>
                      <p className="pet-type"><strong>Contacto:</strong>
                        <span className="phone-with-whatsapp">
                          {petInfo.contactPhone}
                          <a
                            target="_blank"
                            href={`https://wa.me/54${petInfo.vetPhone}`}
                            className="whatsapp-link"
                            rel="noreferrer"
                          >
                            <i className="fab fa-whatsapp"></i>
                          </a>
                        </span>
                      </p>
                      <p><strong>Dirección:</strong> {petInfo.vetAddress}    <a
                        href={`https://www.google.com/maps?q=${encodeURIComponent(petInfo.vetAddress)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="maps-link"
                      >
                        <i className="fas fa-map-marker-alt"></i>
                      </a></p>
                    </div>
                  )}
                </div>

              </div>

              <button className="back-button" onClick={() => setShowOwnerInfo(false)}>
                ← Volver
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Pet;
