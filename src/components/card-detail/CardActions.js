import React, { useContext } from "react";
import {
  User,
  Tag,
  CheckSquare,
  Calendar,
  Paperclip,
  MapPin,
} from "lucide-react";
import CardContext from "../../contexts/CardContext";

const actionItems = [
  { icon: User, label: "Members" },
  { icon: Tag, label: "Labels" },
  { icon: CheckSquare, label: "Checklist" },
  { icon: Calendar, label: "Due Date" },
  { icon: Paperclip, label: "Attachment" },
  {
    icon: "img",
    label: "Cover",
    imgSrc: "/placeholder.svg?height=16&width=16",
  },
];

const menuActions = ["Move", "Copy", "Make Template", "Delete"];

const ActionButton = ({ icon: Icon, label, imgSrc }) => (
  <button className="flex w-full items-center rounded p-2 text-gray-700 hover:bg-gray-200">
    {imgSrc ? (
      <img src={imgSrc} alt={label} className="mr-2 h-4 w-4" />
    ) : (
      <Icon size={16} className="mr-2" />
    )}
    {label}
  </button>
);

const CardActions = () => {
  const { cardId, handleDelete } = useContext(CardContext);

  const menuActions = [
    { label: "Move", onClick: () => console.log("Move action clicked") },
    { label: "Copy", onClick: () => console.log("Copy action clicked") },
    {
      label: "Make Template",
      onClick: () => console.log("Make Template action clicked"),
    },
    { label: "Delete", onClick: () => handleDelete(cardId) },
  ];
  return (
    <div className="bg-gray-50 p-6">
      <h3 className="mb-4 text-sm font-semibold">ADD TO CARD</h3>
      <div className="space-y-2">
        {actionItems.map((item) => (
          <ActionButton key={item.label} {...item} />
        ))}
      </div>

      <h3 className="mb-4 mt-6 text-sm font-semibold">POWER-UPS</h3>
      <ActionButton icon={MapPin} label="Location" />
      <button className="mt-2 text-blue-500 hover:underline">
        Get More Power-Ups
      </button>

      <h3 className="mb-4 mt-6 text-sm font-semibold">ACTIONS</h3>

      {menuActions.map(({ label, onClick }) => (
        <button
          key={label}
          className={`w-full rounded p-2 text-left ${
            label === "Delete"
              ? "text-red-500 hover:bg-red-100"
              : "text-gray-700 hover:bg-gray-200"
          }`}
          onClick={onClick}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default CardActions;
