import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import CreateEvent from "./CreateEvent";
import Pet from "./PetPage"
import PetNotFound from "./PetNotFound";
import Home from "./Home";
import Login from "./Login"; 
import ProtectedRoute from "./ProtectedRoute"; // Import protected route
function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/pet" element={<Pet />} />
        <Route path="/pet/pet-not-found" element={<PetNotFound />} />
        <Route path="/" element={<Home />} />

        <Route
          path="/admin/create"
          element={isAuthenticated ? <CreateEvent /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;

// function App() {
//   return (
//     <Router>
//       <Routes>
//       <Route path="/login" element={<Login />} />
//        <Route path="/pet" element={<Pet />} />
//         <Route path="/admin/create" element={<CreateEvent />} /> 
//         <Route path="/pet/pet-not-found" element={<PetNotFound />} />
//         <Route path="/" element={<Home />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
