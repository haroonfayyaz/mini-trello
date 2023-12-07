import logoImage from "../assets/images/logo.png";
import React from "react";

function Header() {
  return (
    <header className="flex h-fit items-center justify-start space-x-2 bg-slate-300 px-4 py-1 text-4xl font-semibold italic text-blue-800 shadow-sm">
      <img src={logoImage} alt="mini-trello" className="h-14 w-14 rounded-md" />
      <span>Mini Trello</span>
    </header>
  );
}

export default Header;
