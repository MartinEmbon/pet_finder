import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../src/assets/styles/ListPets.css"
import Header from "./Components/Header/Header";
const ListPets = () => {
    const [pets, setPets] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPets = async () => {
            const credentials = JSON.parse(localStorage.getItem("credentials"));
            const userEmail = credentials?.email || "";

            if (!userEmail) {
                return;
            }

            try {
                const response = await axios.get("https://us-central1-pet-finder-450419.cloudfunctions.net/list-pets", {
                    params: { email: userEmail }
                });
                console.log(response.data)
                if (response.data.length === 0) {
                    setErrorMessage("No pets found for this user.");
                } else {
                    setPets(response.data);
                }
            } catch (error) {
                console.error("Error fetching pets:", error);
                setErrorMessage("Error retrieving pets.");
            }
        };

        fetchPets();
    }, []);
    return (
        <div className="list-pets-container">

            <Header />

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <div className="pets-table-container">
                <h2>Lista de mascotas registradas</h2>
                <table className="pets-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Raza</th>
                            <th>Imagen</th>
                            <th>Dueño</th>
                            <th>Contacto</th>
                            <th>Dirección</th>
                            <th>Registrado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pets.map((pet) => (
                            <tr key={pet.petId}>
                                <td>
                                    <a
                                        className="table-link"
                                        href={`https://pet-finder-navy.vercel.app/pet?petId=${pet.petId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Ver Perfil
                                    </a>
                                </td>
                                <td>{pet.petName}</td>
                                <td>{pet.petType}</td>
                                <td><img src={pet.coverImageUrl} alt={pet.petName} /></td>
                                <td>{pet.ownerName}</td>
                                <td>{pet.contactPhone}</td>
                                <td>{pet.location}</td>

                                <td>{new Date(pet.dateRegistry).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button onClick={() => navigate("/admin/create")} className="back-button-list-pets">
                Volver
            </button>
        </div>
    );
};
export default ListPets;
