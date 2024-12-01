import _ from "lodash";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@apollo/client";
import { ADD_CARD_TO_LIST, DELETE_LIST } from "../graphql/queries/list";
import { CREATE_CARD } from "../graphql/queries/card";
import { ItemTypes } from "./Constants";
import { RenderIf } from "../utils/common";
import { useDrop } from "react-dnd";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import ButtonWithIcon from "./ButtonWithIcon";
import Card from "./Card";
import InputForm from "./InputForm";
import ListContext from "../contexts/ListContext";
import React, { useContext, useState } from "react";
import SpinnerContext from "../contexts/SpinnerContext";

export default function List({ onDrop, list }) {
  const [showNewTaskInput, setShowNewTaskInput] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const setLists = useContext(ListContext);
  const setShowSpinner = useContext(SpinnerContext);

  const [createCard] = useMutation(CREATE_CARD);
  const [addCardToList] = useMutation(ADD_CARD_TO_LIST);
  const [deleteList] = useMutation(DELETE_LIST);

  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      drop: (item) => onDrop(item, list.id),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [onDrop, list.id],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setShowSpinner(true);
      const {
        data: {
          createCard: { card },
        },
      } = await createCard({ variables: { title: newTaskText } });
      const {
        data: {
          addCardToList: {
            list: { id: listId },
          },
        },
      } = await addCardToList({
        variables: { listId: list.id, cardId: card.id },
      });
      setShowSpinner(false);

      if (listId) {
        setLists((prev) => {
          const updatedLists = _.cloneDeep(prev);
          const indexToUpdate = _.findIndex(updatedLists, ["id", listId]);
          updatedLists[indexToUpdate].cards.push(card);
          return updatedLists;
        });
      }
      setNewTaskText("");
      setShowNewTaskInput(false);
    } catch (error) {}
  };

  const handleDelete = async (id) => {
    try {
      setShowSpinner(true);
      const {
        data: {
          deleteList: { success },
        },
      } = await deleteList({ variables: { id } });
      setShowSpinner(false);

      if (success) setLists((prev) => prev.filter((list) => list.id !== id));
    } catch (error) {}
  };

  return (
    <div ref={dropRef} className={`${isOver && "animate-pulse"}`}>
      <div className="flex h-fit w-[272px] flex-col rounded-xl bg-gray-100 p-3 shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <h2 className={`text-lg font-medium ${list.textColor}`}>
            {`${_.startCase(list.name)} (${_.size(list.cards)})`}
            <FontAwesomeIcon
              icon={sortOrder === "asc" ? faArrowUp : faArrowDown}
              title="Sort By Date"
              className="ml-2 text-gray-400 hover:cursor-pointer hover:text-gray-600"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            />
          </h2>
          <ButtonWithIcon
            color={"bg-red-400"}
            hoverColor={"bg-red-500"}
            title={"Remove List"}
            icon={faTrash}
            onClick={() => handleDelete(list.id)}
          />
        </div>
        <div className="custom-scrollbar max-h-[calc(100vh-200px)] overflow-y-auto">
          <ul className="space-y-2">
            {_.orderBy(list.cards, ["timestamp"], [sortOrder]).map((card) => (
              <Card key={card.id} card={card} listId={list.id} />
            ))}
          </ul>
        </div>
        <RenderIf
          isTrue={showNewTaskInput}
          fallback={
            <button
              onClick={() => setShowNewTaskInput(true)}
              className="mt-2 flex w-full items-center rounded-lg p-2 text-gray-600 hover:bg-gray-200"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Add a card
            </button>
          }
        >
          <InputForm
            onSubmit={(e) => handleSubmit(e)}
            placeholder="Enter card title..."
            onBlur={() => {
              setShowNewTaskInput(false);
              setNewTaskText("");
            }}
            onChange={(e) => setNewTaskText(e.target.value)}
            value={newTaskText}
          />
        </RenderIf>
      </div>
    </div>
  );
}
