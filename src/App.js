import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CreateEvent from "./CreateEvent";
import AlbumPage from "./AlbumPage"
function App() {
  return (
    <Router>
      <Routes>
       <Route path="/album" element={<AlbumPage />} />
        <Route path="/admin/create" element={<CreateEvent />} /> 
      </Routes>
    </Router>
  );
}

export default App;
