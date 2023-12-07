import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function ButtonWithIcon({ color, hoverColor, title, onClick, icon }) {
  return (
    <button
      className={`flex h-6 w-6 items-center justify-center place-self-end rounded-md ${color} text-white hover:${hoverColor}`}
      title={title}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
}

export default ButtonWithIcon;
