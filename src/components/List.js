import React, { useState, useEffect, useContext } from "react";
import _ from "lodash";
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
import { TaskContext } from "./TaskBoard";
import InputForm from "./InputForm";

const CREATE_CARD = gql`
  mutation CreateCard($title: String!, $description: String!, $estimate: Int!) {
    createCard(title: $title, description: $description, estimate: $estimate) {
      card {
        id
        title
        description
        timestamp
        estimate
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

const ADD_CARD_TO_LIST = gql`
  mutation AddCardToList($listId: ID!, $cardId: ID!) {
    addCardToList(listId: $listId, cardId: $cardId) {
      list {
        id
        name
        cards {
          id
          title
          description
          estimate
        }
      }
    }
  }
`;

export default function List({
  // setSuccess,
  cards: listTasks,
  id,
  name,
  onDrop,
  textColor,
  setLists,
}) {
  const setSuccess = useContext(TaskContext);
  const [tasks, setTasks] = useState(listTasks);
  const [createCard, { data: createdCard }] = useMutation(CREATE_CARD);
  const [deleteList, { data: deletedList }] = useMutation(DELETE_LIST);
  const [addTaskToList, { data: taskAddedToList }] =
    useMutation(ADD_CARD_TO_LIST);

  const [showNewTaskInput, setShowNewTaskInput] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      drop: (item) => onDrop(item, id),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [onDrop, id],
  );
  const handleSubmit = (e) => {
    e.preventDefault();

    setSuccess("");
    setNewTaskTitle("");
    setShowNewTaskInput(false);
    createCard({
      variables: { title: newTaskTitle, description: "", estimate: 0 },
    });
  };

  const handleDelete = () => {
    setSuccess("");
    deleteList({ variables: { id } });
  };

  useEffect(() => {
    if (!createdCard) return;

    setSuccess("");
    addTaskToList({
      variables: { listId: id, cardId: createdCard.createCard?.card?.id },
    });
  }, [createdCard]);

  useEffect(() => {
    if (!deletedList) return;

    setSuccess("Card deleted successfully");
  }, [deletedList]);

  useEffect(() => {
    if (!taskAddedToList) return;

    setSuccess("Task added to list successfully");
  }, [taskAddedToList]);

  return (
    <div ref={dropRef} className={`${isOver && "animate-pulse"}`}>
      <div className="flex min-w-[300px] animate-fade flex-col rounded-md bg-slate-200 bg-opacity-90 p-4 shadow-md">
        <div className="mb-4 flex flex-row items-center justify-between">
          <h2 className={`text-2xl font-semibold ${textColor}`}>
            {`${_.startCase(name)} (${_.size(tasks)})`}
          </h2>
          <ButtonWithIcon
            color="bg-red-500"
            hoverColor="bg-red-600"
            title="Remove List"
            icon={faTrash}
            onClick={() => handleDelete()}
          />
        </div>
        <ul>
          {tasks.map((task, index) => (
            <Card key={index} task={task} setTasks={setTasks} />
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
              setNewTaskTitle("");
            }}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            value={newTaskTitle}
          />
        </RenderIf>
      </div>
    </div>
  );
}
