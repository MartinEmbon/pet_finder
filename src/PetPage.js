import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "./Components/Header/Header";
import { API_LIST_PET } from "./endpoints";
import { translationsAlbumPage } from "./albumPageTranslation";

import "./assets/styles/PetPage.css"

function Pet() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const petId = queryParams.get("petId");

  const [petInfo, setPetInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingEventDetails, setIsLoadingEventDetails] = useState(true); // Loading state for event details
  const lang = navigator.language.split("-")[0]; // Get the language code (es or pt)

  const content = translationsAlbumPage[lang]
    ? translationsAlbumPage[lang]
    : translationsAlbumPage["en"]; // Fallback to 'en'


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
        petType,
        description,
        location,
        contactPhone,
        contactName
      } = response.data;

      // Check if contactInfo exists and extract contactName and contactPhone

      setPetInfo({
        coverImageUrl,
        customMessage,
        petName,
        petType,
        description,
        location,
        contactPhone,
        contactName
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
        <p className="loading-text">{content.loading}</p>
      </div>
    );
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <div>
      <Helmet>
        <title>{petInfo.petName}'s Profile</title>
      </Helmet>
      <Header />
      <div className="pet-card">
        <img src={petInfo.coverImageUrl} alt={petInfo.petName} />
        <div className="info">
          <h1>{petInfo.petName}</h1>
          <p><strong>About me:</strong> {petInfo.customMessage}</p>
          <p className="pet-type">
            <strong>Pet Type:</strong> {petInfo.petType}
          </p>
          <p>
            <strong>Description:</strong> {petInfo.description}
          </p>
          <p>
            <strong>Location:</strong> {petInfo.location}
          </p>
          {petInfo.contactName && (
            <div className="contact-info">
              <strong>Contact Name:</strong> {petInfo.contactName}
            </div>
          )}
       {petInfo.contactPhone && (
  <div className="contact-info">
    <strong>Contact Phone:</strong>{" "}
    <a
      target="_blank"
      href={`https://wa.me/${petInfo.contactPhone}`}
      className="whatsapp-link"
      rel="noreferrer"
    >
       {petInfo.contactPhone}
      <i className="fab fa-whatsapp"></i> {/* WhatsApp icon */}
    </a>
  </div>
)}

        </div>
      </div>
    </div>
  );

}

export default Pet;
