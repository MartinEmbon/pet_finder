import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Helmet } from "react-helmet";

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
    const [petColor, setPetColor] = useState("");
    const [petType, setPetType] = useState(""); // tipo
    const [petName, setPetName] = useState(""); // nombre
    const [petGender, setPetGender] = useState(""); // género
    const [petBreed, setPetBreed] = useState(""); // raza
    const [dateBirth, setDateBirth] = useState(""); // fecha nacimiento
    const [petCharacter, setPetCharacter] = useState(""); // caracter
    const [microChip, setMicrochip] = useState(""); // microchip
    const [microChipNumber, setMicrochipNumber] = useState(""); // microchip
    const [sterilized, setSterilized] = useState("")
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [vetAddress, setVetAddress] = useState("")
    const [vetName, setVetName] = useState("");
    const [vetPhone, setVetPhone] = useState("");
    const [userEmail, setUserEmail] = useState("");
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
    const [uploadButtonText, setUploadButtonText] = useState("Subir Imagen");

    const hiddenCanvasRef = useRef(null); // For the hidden QR code canvas
    const [profileCount, setProfileCount] = useState(0);
    const [maxProfiles, setMaxProfiles] = useState(5); // Default limit

    useEffect(() => {
        // Retrieve user email from localStorage (or session)
        const credentials = JSON.parse(localStorage.getItem("credentials"));
        if (credentials?.email) {
            setUserEmail(credentials.email);
            fetchUserProfileCount(credentials.email);
        }
    }, []);

    // Function to fetch profile count from backend
    const fetchUserProfileCount = async (email) => {
        try {
            const response = await axios.get(`https://us-central1-pet-finder-450419.cloudfunctions.net/getUserProfileCount?email=${email}`);
            if (response.data) {
                setProfileCount(response.data.profileCount);
                setMaxProfiles(response.data.maxProfiles);
            }
        } catch (error) {
            console.error("Error fetching profile count:", error);
        }
    };

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

        if (profileCount >= maxProfiles) {
            alert("Has alcanzado el límite de perfiles permitidos.");
            return;
        }


        // Retrieve user email from localStorage
        const credentials = JSON.parse(localStorage.getItem("credentials"));
        const userEmail = credentials?.email || ""; // If no email found, default to an empty string

        // Add emoji to the customMessage
        const messageWithEmoji = `${customMessage} 🐾✨`;  // Add an emoji at the end


        // When submitting, apply the formatting to the pet name.
        const formattedName = petName
            .trim()  // Remove leading/trailing spaces
            .replace(/\s+/g, ' ') // Replace multiple spaces with one space
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word

        // Generate the petId (all lowercase, concatenating formatted name and timestamp)
        const timestamp = Date.now(); // Unique timestamp
        const generatedId = `${formattedName.replace(/\s+/g, '').toLowerCase()}-${timestamp}`;
        setPetId(generatedId);

        // Now submit the data (you can call your API or whatever you need here)
        console.log('Submitting:', formattedName, generatedId);
        // Add your submit logic here...
        setIsCreating(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            // Create JSON payload
            const payload = {
                petId: generatedId,
                uploadedImageUrl,
                customMessage: messageWithEmoji,
                petName: formattedName,
                petColor,
                petType,
                petBreed,
                petCharacter,
                dateBirth,
                microChip,
                microChipNumber,
                sterilized,
                description,
                location,
                ownerName,
                contactPhone,
                vetName,
                vetPhone,
                vetAddress,
                userEmail

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
                // Update profile count in users collection
                await axios.put("https://us-central1-pet-finder-450419.cloudfunctions.net/update-profile_count", { email: userEmail });

                // ✅ Fetch updated profile count after update
                fetchUserProfileCount(userEmail);
                // Generate and set the event URL
                const generatedUrl = `https://pet-finder-navy.vercel.app/pet?petId=${generatedId}`;
                setEventUrl(generatedUrl);

                // Clear inputs
                setPetId("");
                setCoverImageUrl("");
                setCoverImageFile(null);
                setCustomMessage("");
                setPetColor("")
                setPetName("");
                setPetType("");
                setPetCharacter("")
                setSterilized("")
                setPetBreed("")
                setDateBirth("");
                setMicrochip("")
                setMicrochipNumber("")
                setSecret(""); // Clear secret input
                setDescription("")
                setLocation("")
                setOwnerName("")
                setContactPhone("")
                setVetName("")
                setVetPhone("")
                setVetAddress("")
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
            return null;
        }

        try {
            setUploadButtonText("Subiendo...")

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
                // setSuccessMessageFileUpload("La imagen se subió correctamente.");
                setCoverImageFile(null);
                // setSuccessMessageFileUpload("La imagen se subió correctamente.");
                // Change the button text using the className
                setUploadButtonText("Imagen subida");

                // const uploadButton = document.querySelector(".uploadButton");
                // if (uploadButton) {
                //     uploadButton.textContent = "Imagen subida con éxito";
                // }
            } else {
                throw new Error("Failed to upload image to Cloud Storage");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            setErrorMessageFileUpload("Error al subir la imagen.");
            setUploadButtonText("Subir Imagen"); // Reset button text on error

        }
    };

    // Function to log out and redirect to /login
    const handleLogout = () => {
        // Clear any authentication tokens or session data if needed
        localStorage.removeItem("credentials"); // Remove stored credentials
        dispatch(logout()); // Dispatch logout action
        navigate("/login"); // Redirect to login page
    };

    const handleReset = () => {
        // Clear all the states related to the form fields
        setCoverImageFile(null);
        setCoverImageUrl("");
        setUploadedImageUrl("");
        setSuccessMessageFileUpload("");
        setErrorMessageFileUpload("");
        setPetId("");
        setPetColor("")
        setVetName("")
        setVetPhone("")
        setSterilized("")
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
        setVetAddress("")

    };

    const handlePetNameChange = (e) => {
        setPetName(e.target.value);

    };

    return (
        <div className="create-event-container">
            <Helmet>
                <title>Crear mascota</title>
            </Helmet>
            <Header className="header-with-margin" />

            <button onClick={handleLogout} className="logout-button">Salir</button>
            <button className="reset-button" onClick={handleReset}>Limpiar</button>
            {/* Navigate to List Pets Page */}
            <button className="list-pets-button" onClick={() => navigate("/list-pets")}>

                Listado
            </button>
            <h2>Creá el perfil de tu mascota</h2>
            <div className="profiles-created">
                <p>Perfiles creados: {profileCount} / {maxProfiles}</p>
            </div>


            {/* <h2>Subir Imagen de Portada</h2> */}
            <form onSubmit={handleFileUpload}>
                <label>Elegí la foto de tu mascota y presioná 'Subir imagen'.</label>
                <input
                    type="file"
                    onChange={(e) => setCoverImageFile(e.target.files[0])}
                    required
                    className="uploadFile"
                />
                <button className="uploadButton" type="submit">{uploadButtonText}</button>
                {successMessageFileUpload && (
                    <p className="success-message">{successMessageFileUpload}</p>
                )}

                {/* Display error message if exists */}
                {errorMessageFileUpload && (
                    <p className="error-message">{errorMessageFileUpload}</p>
                )}

                {/* Display the uploaded image URL for the user to copy */}
                {/* {uploadedImageUrl && (
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
                )} */}
            </form>

            <hr />

            <form onSubmit={handleCreateEvent}>

                <label>Nombre de tu mascota:</label>
                <input
                    type="text"
                    value={petName}
                    onChange={handlePetNameChange}
                    placeholder="Nombre de tu mascota"
                    required
                />
                <label>Tipo de mascota:</label> {/* New input field */}
                <input
                    type="text"
                    value={petType}
                    onChange={(e) => {
                        const formattedType = e.target.value
                            .toLowerCase()
                            .replace(/\b\w/g, (char) => char.toUpperCase());
                        setPetType(formattedType);
                    }} placeholder="Perro, gato, etc."
                    required
                />

                <label className="after-race">Raza:</label>
                <input
                    type="text"
                    value={petBreed}
                    onChange={(e) => setPetBreed(e.target.value)}
                    placeholder="Bulldog Francés, Labrador, Maine Coon"
                    required
                />

                <label>Género:</label>
                <div className="gender-radio-group inline">
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

                <label className="after-race">Color:</label>
                <input
                    type="text"
                    value={petColor}
                    onChange={(e) => setPetColor(e.target.value)}
                    placeholder="Color de tu mascota"
                    required
                />
                <label>Castrado:</label>
                <div className="gender-radio-group inline">
                    <label>
                        <input
                            type="radio"
                            value="Si"
                            checked={sterilized === "Si"}
                            onChange={(e) => setSterilized(e.target.value)}
                        />
                        Si
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="No"
                            checked={sterilized === "No"}
                            onChange={(e) => setSterilized(e.target.value)}
                        />
                        No
                    </label>
                </div>
                <label>Carácter:</label>
                <input
                    type="text"
                    value={petCharacter}
                    onChange={(e) => setPetCharacter(e.target.value)}
                    placeholder="Juguetón, cariñoso, tranquilo"
                    required
                />

                <label>Describí tu mascota:</label>
                <input
                    type="text"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Apariencia, comportamiento, personalidad"
                />

                {/* <label>Descripción de tu mascota:</label> 
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción de tu mascota"
                    required
                /> */}

                <label>Microchip:</label>
                <div className="gender-radio-group">
                    <label>
                        <input
                            type="radio"
                            value="Si"
                            checked={microChip === "Si"}
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

                {microChip === "Si" && (
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

                <label>Nombre de contacto</label> {/* New input field */}
                <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => {
                        const formattedName = e.target.value
                            .toLowerCase()
                            .replace(/\b\w/g, (char) => char.toUpperCase());
                        setOwnerName(formattedName);
                    }} placeholder="Nombre de contacto"
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

                {/* <label>URL para imagen de portada:</label>
                <input
                    type="text"
                    // value={coverImageUrl}
                    value={uploadedImageUrl}
                    // onChange={(e) => setCoverImageUrl(e.target.value)}
                    placeholder="URL de la imagen de portada"
                    required
                /> */}

                <label>Dirección</label> {/* New input field */}
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Dirección"
                    required
                />

                <label>Nombre del veterinario</label> {/* New input field */}
                <input
                    type="text"
                    value={vetName}
                    onChange={(e) => setVetName(e.target.value)}
                    placeholder="Nombre del veterinario"

                />

                <label>Teléfono de veterinario</label> {/* New input field */}
                <input
                    type="text"
                    value={vetPhone}
                    onChange={(e) => setVetPhone(e.target.value)}
                    placeholder="Teléfono de veterinario"

                />

                <label>Dirección de la veterinaria</label> {/* New input field */}
                <input
                    type="text"
                    value={vetAddress}
                    onChange={(e) => setVetAddress(e.target.value)}
                    placeholder="Dirección de la veterinaria"
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
                            Tu mascota se creó con éxito. Accedé a la página de perfil en el
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

                    </div>
                )}
            </form>

            <footer className="support-footer">
                <p>
                    Si experimentás algún inconveniente durante la creación del perfil de tu mascota,
                    escribinos a{" "}
                    <a href="mailto:contacto@pet-connect.com">
                        contacto@pet-connect.com
                    </a>
                    .
                </p>
            </footer>
        </div>
    );
};

export default CreateEvent;
