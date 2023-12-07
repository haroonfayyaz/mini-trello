import _ from "lodash";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { ItemTypes } from "./Constants";
import { useDrag } from "react-dnd";
import ButtonWithIcon from "./ButtonWithIcon";
import React from "react";

export default function Card({ listId, task }) {
  const [{ opacity }, dragRef] = useDrag(
    () => ({
    type: ItemTypes.CARD,
      item: { task, dragListId: listId },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
      }),
    }),
    [task, listId],
  );

  const handleDelete = (id) => {
    // setLists((prev) => {
    //   const updatedLists = _.cloneDeep(prev);
    //   updatedLists[_.findIndex(updatedLists, ["id", listId])].tasks =
    //     updatedLists[_.findIndex(updatedLists, ["id", listId])].tasks.filter(
    //       (t) => t.id !== id,
    //     );
    //   return updatedLists;
    // });
  };

  return (
    <div ref={dragRef} style={{ opacity }}>
      <li className="mb-4 animate-fade-up rounded-md bg-white p-2">
        <div className="flex flex-col items-start justify-center space-y-2">
          <span className="text-sm font-light">{task.title}</span>
          <hr className="flex w-full flex-col" />
          <ButtonWithIcon
            color={"bg-red-500"}
            hoverColor={"bg-red-600"}
            title={"Remove Task"}
            icon={faTrash}
            onClick={() => handleDelete(task.id)}
          />
        </div>
      </li>
    </div>
  );
}
