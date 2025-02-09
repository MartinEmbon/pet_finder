import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CreateEvent from "./CreateEvent";



function App() {
  return (


    <Routes>
       <Route path="/" element={<CreateEvent />} />
      <Route path="/admin/create" element={<CreateEvent/>} /> {/* Create new Album */}
 
    </Routes>
  

  );
}

export default App;
