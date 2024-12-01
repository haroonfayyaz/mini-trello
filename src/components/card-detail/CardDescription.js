import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/client";

import { UPDATE_CARD } from "../../graphql/queries/card";
import SpinnerContext from "../../contexts/SpinnerContext";

const CardDescription = ({ card }) => {
  const [description, setDescription] = useState(card?.description);
  const [isEditing, setIsEditing] = useState(false);
  const setShowSpinner = useContext(SpinnerContext);

  const [updateCard] = useMutation(UPDATE_CARD);

  const updateDescription = async () => {
    setShowSpinner(true);
    try {
      const {
        data: {
          updateCard: { success },
        },
      } = await updateCard({ variables: { id: card?.id, description } });

      if (!success) setDescription("");
    } catch (error) {
      console.error("Error updating description: ", error);
    } finally {
      setShowSpinner(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Description</h3>
        <button
          className="text-blue-500 hover:underline"
          onClick={() => {
            setIsEditing(!isEditing);

            if (isEditing) updateDescription();
          }}
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>
      {isEditing ? (
        <textarea
          className="w-full rounded border p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      ) : (
        <p className="text-gray-700">
          {description || "No description available"}
        </p>
      )}
    </div>
  );
};

CardDescription.propTypes = {
  card: PropTypes.object.isRequired,
};

export default CardDescription;
