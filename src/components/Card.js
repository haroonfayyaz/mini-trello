import _ from "lodash";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import { gql, useMutation } from "@apollo/client";
import { ItemTypes } from "./Constants";
import { useDrag } from "react-dnd";
import ButtonWithIcon from "./ButtonWithIcon";
import ListContext from "../contexts/ListContext";
import React, { useContext } from "react";
import SpinnerContext from "../contexts/SpinnerContext";

const DELETE_CARD = gql`
  mutation DeleteCard($id: ID!) {
    deleteCard(id: $id) {
      success
    }
  }
`;

export default function Card({ card, listId }) {
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

  return (
    <div ref={dragRef} style={{ opacity }}>
      <li className="mb-4 animate-fade-up rounded-md bg-white p-2">
        <div className="flex flex-col items-start justify-center space-y-2">
          <span className="text-sm font-light">{card.title}</span>
          <hr className="flex w-full flex-col" />
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center space-x-1 text-sm font-light text-gray-400">
              <FontAwesomeIcon className="" icon={faClock} />
              <span> {format(new Date(card.timestamp), "MMM d")}</span>
            </div>
            <ButtonWithIcon
              color={"bg-red-500"}
              hoverColor={"bg-red-600"}
              title={"Remove Task"}
              icon={faTrash}
              onClick={() => handleDelete(card.id)}
            />
          </div>
        </div>
      </li>
    </div>
  );
}
