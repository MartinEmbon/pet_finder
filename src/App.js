import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CreateEvent from "./CreateEvent";
import Pet from "./PetPage"
import PetNotFound from "./PetNotFound";
import Home from "./Home";
function App() {
  return (
    <Router>
      <Routes>
       <Route path="/pet" element={<Pet />} />
        <Route path="/admin/create" element={<CreateEvent />} /> 
        <Route path="/pet/pet-not-found" element={<PetNotFound />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
