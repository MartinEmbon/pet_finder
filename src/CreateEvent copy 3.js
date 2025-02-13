import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";
import Header from "./Components/Header/Header";
import axios from "axios";
// import "./App.css";
import "./assets/styles/CreateEvent.css";
import { QRCodeCanvas } from "qrcode.react";
import { logout } from "./slices/authSlice"; // Import the logout action

import { API_PET_URL } from "./endpoints";

const SECRET_KEY = "Catalina83";

const CreateEvent = () => {

    const navigate = useNavigate(); // Initialize useNavigate

    const dispatch = useDispatch();

    const [step, setStep] = useState(1); // Step state to control form flow

    const [petId, setPetId] = useState("");
    const [petType, setPetType] = useState(""); // tipo
    const [petName, setPetName] = useState(""); // nombre
    const [petGender, setPetGender] = useState(""); // género
    const [petBreed, setPetBreed] = useState(""); // raza
    const [dateBirth, setDateBirth] = useState(""); // fecha nacimiento
    const [petCharacter, setPetCharacter] = useState(""); // caracter
    const [microChip, setMicrochip] = useState(""); // microchip
    const [microChipNumber, setMicrochipNumber] = useState(""); // microchip

    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [contactPhone, setContactPhone] = useState("");

    const [coverImageUrl, setCoverImageUrl] = useState("");
    const [coverImageFile, setCoverImageFile] = useState(null); // For file upload
    const [customMessage, setCustomMessage] = useState("");

    const [secret, setSecret] = useState(""); // State for secret input
    const [isCreating, setIsCreating] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [successMessageFileUpload, setSuccessMessageFileUpload] = useState("");
    const [errorMessageFileUpload, setErrorMessageFileUpload] = useState("");

    const [eventUrl, setEventUrl] = useState(""); // State to store the event URL

    const qrCodeRef = useRef(null); // Ref for the QR code


    const [uploadedImageUrl, setUploadedImageUrl] = useState(""); // To store the uploaded image URL

    const [qrCodeFile, setQrCodeFile] = useState(null);
    const [uploadedQRCodeUrl, setUploadedQRCodeUrl] = useState(""); // Added state for uploaded QR code URL


    const hiddenCanvasRef = useRef(null); // For the hidden QR code canvas

    // Function to calculate the age based on the birth date
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const birthDateObj = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const month = today.getMonth();
    if (month < birthDateObj.getMonth() || (month === birthDateObj.getMonth() && today.getDate() < birthDateObj.getDate())) {
      age--; // Subtract 1 if the birthdate hasn't occurred yet this year
    }
    return age;
  };

  const handleDateChange = (e) => {
    setDateBirth(e.target.value);
  };



    const downloadQRCode = () => {
        const qrCanvas = hiddenCanvasRef.current.querySelector("canvas");
        if (qrCanvas) {
            const url = qrCanvas.toDataURL("image/png");
            const petId = eventUrl.split("petId=")[1] || "QR_Code";
            const link = document.createElement("a");
            link.href = url;
            link.download = `${petId}.png`;
            link.click();
        } else {
            console.error("QR code canvas not found!");
        }
    };

    const handleQRCodeUpload = async (event) => {
        event.preventDefault();
        setErrorMessageFileUpload("");
        setSuccessMessageFileUpload("");

        if (!qrCodeFile) {
            setErrorMessageFileUpload("Por favor, selecciona un archivo para subir.");
            return;
        }

        try {
            const response = await axios.post(
                "https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/add-qr-code-to-storage",
                {
                    filename: qrCodeFile.name,
                    contentType: qrCodeFile.type,
                }
            );

            if (response.status !== 200) {
                throw new Error("Failed to get signed URL");
            }

            const { uploadUrl, publicUrl } = response.data;

            console.log("Received upload URL:", uploadUrl);
            console.log("Public URL:", publicUrl);

            const uploadResponse = await axios.put(uploadUrl, qrCodeFile, {
                headers: {
                    "Content-Type": qrCodeFile.type,
                },
            });

            if (uploadResponse.status === 200) {
                console.log("QR Code uploaded successfully!");

                setUploadedQRCodeUrl(publicUrl); // Set the uploaded QR code URL here
                setSuccessMessageFileUpload("El código QR se subió correctamente.");
                setQrCodeFile(null);
            } else {
                throw new Error("Failed to upload QR code to Cloud Storage");
            }
        } catch (error) {
            console.error("Error uploading QR code:", error);
            setErrorMessageFileUpload("Error al subir el código QR.");
        }
    };

    const handleNext = () => {
        setStep(step + 1);
    };

    const handlePrev = () => {
        setStep(step - 1);
    };

    const handleCreateEvent = async (event) => {
        event.preventDefault();
        setIsCreating(true);
        setErrorMessage("");
        setSuccessMessage("");

        // Check if the entered secret is correct
        if (secret !== SECRET_KEY) {
            setErrorMessage("Invalid secret key.");
            setIsCreating(false);
            return;
        }
        // Function to download the QR code as an image

        try {
            // Create JSON payload
            const payload = {
                petId,
                coverImageUrl,
                customMessage,
                petName,
                petType,
                petBreed,
                petCharacter,
                dateBirth,
                microChip,
                microChipNumber,
                description,
                location,
                ownerName,
                contactPhone
            };

            // Handle file upload separately if needed
            if (coverImageFile) {
                // Upload file to a storage service (e.g., Firebase Storage) and get the URL
                // Example placeholder for file upload logic
                // const fileUrl = await uploadFile(coverImageFile);
                // payload.coverImageUrl = fileUrl; // Update payload with file URL
            }

            // Send JSON payload
            const response = await axios.post(API_PET_URL, payload, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.data.success) {
                setSuccessMessage("¡La mascota se ha creado con éxito!");

                // Generate and set the event URL
                const generatedUrl = `https://pet-finder-navy.vercel.app/pet?petId=${petId}`;
                setEventUrl(generatedUrl);

                // Clear inputs
                setPetId("");
                setCoverImageUrl("");
                setCoverImageFile(null);
                setCustomMessage("");
                setPetName("");
                setPetType("");
                setPetCharacter("")
                setPetBreed("")
                setDateBirth("");
                setMicrochip("")
                setMicrochipNumber("")
                setSecret(""); // Clear secret input
                setDescription("")
                setLocation("")
                setOwnerName("")
                setContactPhone("")
            } else {
                setErrorMessage("Hubo un error al crear el evento.");
            }
        } catch (error) {
            console.error("Error creating event:", error);
            setErrorMessage(`${error.response.data.error}`);
            // setErrorMessage(`Error: ${error.message}`);
        } finally {
            setIsCreating(false);
        }
    };

    const handleFileUpload = async (event) => {
        event.preventDefault();
        setErrorMessageFileUpload("");
        setSuccessMessageFileUpload("");

        if (!coverImageFile) {
            setErrorMessageFileUpload("Por favor, selecciona un archivo para subir.");
            return;
        }

        try {
            // Step 1: Get the signed URL from the Cloud Function
            const response = await axios.post(
                "https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/add-cover-photo-album",
                {
                    filename: coverImageFile.name,
                    contentType: coverImageFile.type,
                }
            );

            if (response.status !== 200) {
                throw new Error("Failed to get signed URL");
            }

            const { uploadUrl, publicUrl } = response.data;

            // Log the upload URL and public URL for debugging
            console.log("Received upload URL:", uploadUrl);
            console.log("Public URL:", publicUrl);

            // Step 2: Upload the file using the signed URL
            const uploadResponse = await axios.put(uploadUrl, coverImageFile, {
                headers: {
                    "Content-Type": coverImageFile.type, // Make sure the content type matches the file type
                },
            });

            if (uploadResponse.status === 200) {
                console.log("File uploaded successfully!");

                // Step 3: Update the UI with the public URL
                setUploadedImageUrl(publicUrl);
                setSuccessMessageFileUpload("La imagen se subió correctamente.");
                setCoverImageFile(null);
            } else {
                throw new Error("Failed to upload image to Cloud Storage");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            setErrorMessageFileUpload("Error al subir la imagen.");
        }
    };

     // Function to log out and redirect to /login
     const handleLogout = () => {
        // Clear any authentication tokens or session data if needed
        localStorage.removeItem("credentials"); // Remove stored credentials
    dispatch(logout()); // Dispatch logout action
        navigate("/login"); // Redirect to login page
    };

    return (
        <div className="create-event-container">
           
                <Header />
     
            <button onClick={handleLogout} className="logout-button">Logout</button>

            <h2>Creá el perfil de tu mascota</h2>

            {/* Separate Form for File Upload */}
            {/* <h2>Subir Imagen de Portada</h2> */}
            <form onSubmit={handleFileUpload}>
                <label>Seleccionar archivo:</label>
                <input
                    type="file"
                    onChange={(e) => setCoverImageFile(e.target.files[0])}
                    required
                    className="uploadFile"
                />
                <button type="submit">Subir Imagen</button>
                {successMessageFileUpload && (
                    <p className="success-message">{successMessageFileUpload}</p>
                )}

                {/* Display error message if exists */}
                {errorMessageFileUpload && (
                    <p className="error-message">{errorMessageFileUpload}</p>
                )}

                {/* Display the uploaded image URL for the user to copy */}
                {uploadedImageUrl && (
                    <div>
                        <p>La URL de la imagen cargada:</p>
                        <input
                            type="text"
                            value={uploadedImageUrl}
                            readOnly
                            className="uploadFile"
                            style={{ marginTop: "10px" }}
                        />
                        <button
                            onClick={() => navigator.clipboard.writeText(uploadedImageUrl)}
                            style={{ marginTop: "10px" }}
                        >
                            Copiar URL
                        </button>
                    </div>
                )}
            </form>

            <hr />

            <form onSubmit={handleCreateEvent}>
                <label>Ingresá el ID de tu mascota:</label>
                <input
                    type="text"
                    value={petId}
                    onChange={(e) => setPetId(e.target.value)}
                    placeholder="ID de tu mascota"
                    required
                />
 <label>Tipo de mascota:</label> {/* New input field */}
                <input
                    type="text"
                    value={petType}
                    onChange={(e) => setPetType(e.target.value)}
                    placeholder="Tipo de mascota"
                    required
                />
                <label>Nombre de tu mascota:</label>
                <input
                    type="text"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="Nombre de tu mascota"
                    required
                />

{/* <label>Género:</label>
                <input
                    type="text"
                    value={petGender}
                    onChange={(e) => setPetGender(e.target.value)}
                    placeholder="Nombre de tu mascota"
                    required
                /> */}
<label>Género:</label>
<div className="gender-radio-group">
    <label>
        <input
            type="radio"
            value="Male"
            checked={petGender === "Male"}
            onChange={(e) => setPetGender(e.target.value)}
        />
        Macho
    </label>
    <label>
        <input
            type="radio"
            value="Female"
            checked={petGender === "Female"}
            onChange={(e) => setPetGender(e.target.value)}
        />
        Hembra
    </label>
</div>


<label className="after-race">Raza:</label>
                <input
                    type="text"
                    value={petBreed}
                    onChange={(e) => setPetBreed(e.target.value)}
                    placeholder="Raza de tu mascota"
                    required
                />

<label>Carácter:</label>
                <input
                    type="text"
                    value={petCharacter}
                    onChange={(e) => setPetCharacter(e.target.value)}
                    placeholder="Carácter de tu mascota"
                    required
                />


                <label>Fecha de nacimiento de tu mascota:</label>{dateBirth && (
          <span style={{ marginLeft: "10px", fontSize: "14px", fontWeight: "bold" }}>
            {`Edad: ${calculateAge(dateBirth)} años`}
          </span>
        )}
                <input
                    type="date"
                    value={dateBirth}
                    // onChange={(e) => setDateBirth(e.target.value)}
                    onChange={handleDateChange}

                    placeholder="Fecha de nacimiento:"
                    required
                />


               

                <label>Descripción de tu mascota:</label> {/* New input field */}
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción de tu mascota"
                    required
                />
<label>Microchip:</label>
<div className="gender-radio-group">
    <label>
        <input
            type="radio"
            value="Yes"
            checked={microChip === "Yes"}
            onChange={(e) => setMicrochip(e.target.value)}
        />
        Si
    </label>
    <label>
        <input
            type="radio"
            value="No"
            checked={microChip === "No"}
            onChange={(e) => setMicrochip(e.target.value)}
        />
        No
    </label>
</div>

{microChip === "Yes" && (
    <>
        <label>Número de microchip</label> {/* New input field */}
        <input
            type="text"
            value={microChipNumber}
            onChange={(e) => setMicrochipNumber(e.target.value)}
            placeholder="Número de microchip"
            required
        />
    </>
)}


                <label>Dirección</label> {/* New input field */}
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Dirección"
                    required
                />

                <label>Nombre de contacto</label> {/* New input field */}
                <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Nombre de contacto"
                    required
                />

                <label>Teléfono de contacto</label> {/* New input field */}
                <input
                    type="number"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Teléfono de contacto"
                    required
                />

                <label>URL para imagen de portada:</label>
                <input
                    type="text"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    placeholder="URL de la imagen de portada"
                    required
                />

                <label>Mensaje personalizado:</label>
                <input
                    type="text"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Mensaje personalizado"
                />

                <label>Token de autorización:</label>
                <input
                    type="text"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    placeholder="Secret Key"
                    required
                />
                <button type="submit" disabled={isCreating}>
                    {isCreating ? "Creando..." : "Crear Mascota"}
                </button>
                {isCreating && <p>Creando la mascota, por favor espera...</p>}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}



                {/* Display the event URL after creation */}
                {eventUrl && (
                    <div className="event-url">
                        <p>
                            La mascota ha sido creado exitosamente. Accedé a la página de perfil en el
                            siguiente enlace:
                        </p>
                        <a href={eventUrl} target="_blank" rel="noopener noreferrer">
                            {eventUrl}
                        </a>



                        {/* Generate and display the QR code for the event URL */}
                        <div className="qr-code">
                            <h2>QR Code para la mascota:</h2>
                            <QRCodeCanvas value={eventUrl} size={150} />
                            <i
                                className="fas fa-download download-qr-icon"
                                onClick={downloadQRCode}
                            />
                            <div style={{ display: "none" }} ref={hiddenCanvasRef}>
                                <QRCodeCanvas value={eventUrl} size={1000} />
                            </div>
                        </div>


                        <div>
                            <label>Subir código QR:</label>
                            <input
                                type="file"
                                onChange={(e) => setQrCodeFile(e.target.files[0])}
                                required
                            />
                            <button type="button" onClick={handleQRCodeUpload}>
                                Subir Código QR
                            </button>

                            {successMessageFileUpload && (
                                <p className="success-message">{successMessageFileUpload}</p>
                            )}

                            {errorMessageFileUpload && (
                                <p className="error-message">{errorMessageFileUpload}</p>
                            )}

                            {uploadedQRCodeUrl && (
                                <div style={{ marginTop: "10px" }}>
                                    <p>La URL del código QR cargado:</p>
                                    <input
                                        type="text"
                                        value={uploadedQRCodeUrl}
                                        readOnly
                                        className="uploadFile"
                                        style={{ marginTop: "10px" }}
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent form submission
                                            navigator.clipboard.writeText(uploadedQRCodeUrl);
                                        }}
                                        style={{ marginTop: "10px" }}
                                    >
                                        Copiar URL
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </form>

            <footer className="support-footer">
                <p>
                    Si experimentás algún inconveniente durante la creación del perfil de tu mascota,
                    escribinos a{" "}
                    <a href="mailto:contacto@pet-connect">
                    contacto@pet-connect
                    </a>
                    .
                </p>
            </footer>
        </div>
    );
};

export default CreateEvent;
