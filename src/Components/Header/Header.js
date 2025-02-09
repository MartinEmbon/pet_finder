
import React from 'react';
// import logo from '../../assets/images/logoSnapOk.png';

import logoEs from "../../assets/images/petConnectLogoNoBG.png";
import logoPt from "../../assets/images/petConnectLogoNoBG.png"; // Portuguese logo
import logoEn from "../../assets/images/petConnectLogoNoBG.png"; // Englih logo


const lang = navigator.language.split("-")[0]; // Get the language code (e.g., 'es', 'pt')

// const logo = lang === "pt" ? logoPt : logoEs;
let logo;
if (lang === "pt") {
  logo = logoPt;
} else if (lang === "es") {
  logo = logoEs;
} else {
  logo = logoEn; // Default to English logo if no 'pt' or 'es'
}



const Header = () => (
  <header className="App-header">
    <img src={logo} alt="Logo" className="App-logo" />
  </header>
);

export default Header;
