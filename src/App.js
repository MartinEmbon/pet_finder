import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CreateEvent from "./CreateEvent";
import Pet from "./PetPage"
import PetNotFound from "./PetNotFound";
function App() {
  return (
    <Router>
      <Routes>
       <Route path="/pet" element={<Pet />} />
        <Route path="/admin/create" element={<CreateEvent />} /> 
        <Route path="/pet/pet-not-found" element={<PetNotFound />} />

      </Routes>
    </Router>
  );
}

export default App;
