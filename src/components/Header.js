import React from "react";
import logoImage from "../assets/images/logo.svg";

function Header() {
  return (
    <header className="flex h-[44px] items-center justify-between bg-[#1D2125] px-4">
      <div className="flex items-center space-x-4">
        <img 
          src={logoImage} 
          alt="mini-trello" 
          className="h-[20px] w-[20px] rounded transition-opacity hover:opacity-80" 
        />
        <span className="text-lg font-semibold text-white opacity-90 hover:opacity-100">
          Mini Trello
        </span>
      </div>
      
      <div className="flex items-center space-x-3">
        <button disabled className="rounded bg-[#579DFF]/10 px-3 py-1.5 text-sm font-medium text-[#579DFF] hover:bg-[#579DFF]/20">
          Create
        </button>
        <div className="h-8 w-8 rounded-full bg-gray-500/30 flex items-center justify-center text-sm text-white cursor-pointer hover:bg-gray-500/40">
          AT
        </div>
      </div>
    </header>
  );
}

export default Header;
