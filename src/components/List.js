import _ from "lodash";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { gql, useMutation } from "@apollo/client";
import { ItemTypes } from "./Constants";
import { RenderIf } from "../utils/common";
import { useDrop } from "react-dnd";
import {
  faHandPointDown,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import ButtonWithIcon from "./ButtonWithIcon";
import Card from "./Card";
import InputForm from "./InputForm";
import ListContext from "../contexts/ListContext";
import React, { useContext, useState } from "react";
import SpinnerContext from "../contexts/SpinnerContext";

const CREATE_CARD = gql`
  mutation CreateCard($title: String!) {
    createCard(title: $title) {
      card {
        id
        title
        timestamp
      }
    }
  }
`;

const ADD_CARD_TO_LIST = gql`
  mutation AddCardToList($listId: ID!, $cardId: ID!) {
    addCardToList(listId: $listId, cardId: $cardId) {
      list {
        id
        name
      }
    }
  }
`;

const DELETE_LIST = gql`
  mutation DeleteList($id: ID!) {
    deleteList(id: $id) {
      success
    }
  }
`;

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
      <div className="flex min-w-[90vw] animate-fade flex-col rounded-md bg-slate-200 bg-opacity-90 p-4 shadow-md md:min-w-[20vw]">
        <div className="mb-4 flex flex-row items-center justify-between">
          <h2
            className={`inline-flex items-center space-x-2 text-2xl font-semibold ${list.textColor}`}
          >
            <span>{`${_.startCase(list.name)} (${_.size(list.cards)})`}</span>
            <FontAwesomeIcon
              icon={sortOrder === "asc" ? faArrowUp : faArrowDown}
              title="Sort By Date"
              className="text-gray-500 hover:cursor-pointer"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            />
          </h2>
          <ButtonWithIcon
            color={"bg-red-500"}
            hoverColor={"bg-red-600"}
            title={"Remove List"}
            icon={faTrash}
            onClick={() => handleDelete(list.id)}
          />
        </div>
        <ul>
          {_.orderBy(list.cards, ["timestamp"], [sortOrder]).map((card) => (
            <Card key={card.id} card={card} listId={list.id} />
          ))}
        </ul>
        <RenderIf
          isTrue={showNewTaskInput}
          fallback={
            <ButtonWithIcon
              color={"bg-green-500"}
              hoverColor={"bg-green-600"}
              title={"Create Task"}
              onClick={() => setShowNewTaskInput(true)}
              icon={faPlus}
            />
          }
        >
          <h2 className="inline-flex items-center justify-center space-x-2 text-base font-semibold">
            <span>Enter task name</span>{" "}
            <FontAwesomeIcon icon={faHandPointDown} />
          </h2>
          <InputForm
            onSubmit={(e) => handleSubmit(e)}
            placeholder="Enter task name"
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
