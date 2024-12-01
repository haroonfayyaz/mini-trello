import React from "react";
import { X } from "lucide-react";
import PropTypes from "prop-types";

const CardDetailHeader = ({ title, onClose }) => (
  <div className="mb-4 flex items-start justify-between">
    <h2 className="flex items-center text-xl font-semibold">{title}</h2>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      className="text-gray-500 hover:text-gray-700"
    >
      <X size={24} />
    </button>
  </div>
);

CardDetailHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CardDetailHeader; 
