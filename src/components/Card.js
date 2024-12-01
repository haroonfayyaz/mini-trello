import _ from "lodash";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import { useMutation } from "@apollo/client";
import { DELETE_CARD } from "../graphql/queries/card";
import { ItemTypes } from "./Constants";
import { useDrag } from "react-dnd";
import ButtonWithIcon from "./ButtonWithIcon";
import ListContext from "../contexts/ListContext";
import React, { useContext, useState } from "react";
import SpinnerContext from "../contexts/SpinnerContext";
import CardDetail from "./card-detail/CardDetail";
import CardContext from "../contexts/CardContext";

export default function Card({ card, listId }) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);

  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: ItemTypes.CARD,
      item: { card, dragListId: listId },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
      }),
    }),
    [card, listId],
  );

  const [deleteCard] = useMutation(DELETE_CARD);

  const setLists = useContext(ListContext);
  const setShowSpinner = useContext(SpinnerContext);

  const handleDelete = async (id) => {
    try {
      setShowSpinner(true);
      const {
        data: {
          deleteCard: { success },
        },
      } = await deleteCard({ variables: { id } });
      setShowSpinner(false);

      if (success) {
        setLists((prev) => {
          const updatedLists = _.cloneDeep(prev);
          const indexToUpdate = _.findIndex(updatedLists, ["id", listId]);
          updatedLists[indexToUpdate].cards = updatedLists[
            indexToUpdate
          ].cards.filter((c) => c.id !== id);
          return updatedLists;
        });
      }
    } catch (error) {}
  };

  const openCardDetail = (id) => {
    setSelectedCardId(id);
    setIsDetailOpen(true);
  };

  const onClose = () => {
    setIsDetailOpen(false);
  };

  return (
    <div
      ref={dragRef}
      style={{ opacity }}
      onClick={() => openCardDetail(card.id)}
    >
      <li className="group relative rounded-lg bg-white p-3 shadow hover:bg-gray-50">
        <div className="flex flex-col space-y-2">
          <span className="text-sm text-gray-700">{card.title}</span>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <FontAwesomeIcon icon={faClock} />
              <span>{format(new Date(card.timestamp), "MMM d")}</span>
            </div>
            <ButtonWithIcon
              color={"bg-red-400 opacity-0 group-hover:opacity-100"}
              hoverColor={"bg-red-500"}
              title={"Remove Card"}
              icon={faTrash}
              onClick={() => handleDelete(card.id)}
            />
          </div>
        </div>
      </li>
      {isDetailOpen && (
        <CardContext.Provider value={{ cardId: selectedCardId, handleDelete, onClose }}>
          <CardDetail />
        </CardContext.Provider>
      )}
    </div>
  );
}
