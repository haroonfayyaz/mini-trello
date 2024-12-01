import _ from "lodash";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { RenderIf } from "../utils/common";
import { useQuery, useMutation } from "@apollo/client";
import { GET_LISTS, CREATE_LIST, MANAGE_CARD_IN_LIST } from "../graphql/queries/list";
import ButtonWithIcon from "./ButtonWithIcon";
import InputForm from "./InputForm";
import List from "./List";
import ListContext from "../contexts/ListContext";
import React, { useContext, useEffect, useState } from "react";
import SpinnerContext from "../contexts/SpinnerContext";

const textColors = [
  "text-red-500",
  "text-blue-500",
  "text-green-500",
  "text-yellow-500",
  "text-indigo-500",
  "text-purple-500",
  "text-pink-500",
  "text-orange-500",
  "text-teal-500",
  "text-cyan-500",
];

const TaskBoard = () => {
  const [lists, setLists] = useState([]);
  const [showNewListInput, setShowNewListInput] = useState(false);
  const [newListName, setNewListName] = useState("");

  const { data } = useQuery(GET_LISTS);
  const [createList] = useMutation(CREATE_LIST);
  const [manageCardInList] = useMutation(MANAGE_CARD_IN_LIST);

  const setShowSpinner = useContext(SpinnerContext);

  useEffect(() => {
    setShowSpinner(true);
    if (!data) return;
    setShowSpinner(false);

    setLists(
      data.lists.map((list) => ({ ...list, textColor: _.sample(textColors) })),
    );
  }, [data, setShowSpinner]);

  const handleDrop = async ({ card, dragListId }, dropListId) => {
    setShowSpinner(true);
    const {
      data: {
        manageCardInList: {
          sourceList: { id: sourceListId },
          destinationList: { id: destinationListId },
        },
      },
    } = await manageCardInList({
      variables: {
        sourceListId: dragListId,
        destinationListId: dropListId,
        cardId: card.id,
      },
    });
    setShowSpinner(false);

    if (sourceListId && destinationListId) {
      const updatedLists = _.cloneDeep(lists);
      const indexToUpdate = _.findIndex(updatedLists, ["id", dragListId]);
      updatedLists[indexToUpdate].cards = updatedLists[
        indexToUpdate
      ].cards.filter((c) => c.id !== card.id);
      updatedLists[_.findIndex(updatedLists, ["id", dropListId])].cards.push(
        card,
      );
      setLists(updatedLists);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!_.some(lists, ({ name }) => name === newListName)) {
      try {
        setShowSpinner(true);
        const {
          data: {
            createList: { list },
          },
        } = await createList({ variables: { name: newListName } });
        setShowSpinner(false);

        if (list.id) {
          setLists([
            ...lists,
            {
              ...list,
              textColor: _.sample(textColors),
              cards: [],
            },
          ]);
        }
      } catch (error) {}
    }
    setNewListName("");
    setShowNewListInput(false);
  };

  return (
    <div className="flex h-full items-start justify-start overflow-x-auto overflow-y-hidden bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <div className="flex space-x-4">
        {lists.map((list) => (
          <ListContext.Provider key={list.id} value={setLists}>
            <List onDrop={handleDrop} list={list} />
          </ListContext.Provider>
        ))}
        <div className="h-fit min-w-[272px] rounded-xl bg-white/20 p-3 backdrop-blur-sm transition-all hover:bg-white/30">
          <div className="inline-flex w-full items-center justify-between">
            <h2 className="text-lg font-medium text-white">Add another list</h2>
            <ButtonWithIcon
              color={"bg-white/10"}
              hoverColor={"bg-white/20"}
              title={"Create List"}
              onClick={() => setShowNewListInput(true)}
              icon={faPlus}
            />
          </div>
          <RenderIf isTrue={showNewListInput}>
            <InputForm
              onSubmit={(e) => handleSubmit(e)}
              placeholder="Enter list title..."
              onBlur={() => {
                setShowNewListInput(false);
                setNewListName("");
              }}
              onChange={(e) => setNewListName(e.target.value)}
              value={newListName}
              className="mt-2"
            />
          </RenderIf>
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;
