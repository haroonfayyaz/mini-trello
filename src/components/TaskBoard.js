import React, { useState, useEffect } from "react";
import _ from "lodash";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { RenderIf } from "../utils/common";
import { useQuery, gql, useMutation } from "@apollo/client";
import ButtonWithIcon from "./ButtonWithIcon";
import InputForm from "./InputForm";
import List from "./List";

const textColors = [
  "title-red-500",
  "title-blue-500",
  "title-green-500",
  "title-yellow-500",
  "title-indigo-500",
  "title-purple-500",
  "title-pink-500",
  "title-orange-500",
  "title-teal-500",
  "title-cyan-500",
];

const GET_LISTS = gql`
  query {
    lists {
      id
      name
      cards {
        id
        title
      }
    }
  }
`;

const CREATE_LIST = gql`
  mutation CreateList($name: String!) {
    createList(name: $name) {
      list {
        id
        name
      }
    }
  }
`;

const TaskContext = React.createContext();

const TaskBoard = () => {
  // const { data, refetch } = useQuery(GET_LISTS);
  const [createList, { data: createdList }] = useMutation(CREATE_LIST);
  // const [lists, setLists] = useState([]);
  const [lists, setLists] = useState([
    {
      id: 1,
      name: "completed",
      textColor: _.sample(textColors),
      cards: [
        {
          id: 6,
          title: "Deploy application to production",
        },
        {
          id: 7,
          title: "Create onboarding tutorial",
        },
        {
          id: 12,
          title: "Conduct user testing sessions",
        },
      ],
    },
    {
      id: 2,
      name: "inProgress",
      textColor: _.sample(textColors),
      cards: [
        {
          id: 4,
          title: "Fix bug in data validation",
        },
        {
          id: 5,
          title: "Write unit tests for components",
        },
        {
          id: 11,
          title: "Review and optimize database queries",
        },
      ],
    },
    {
      id: 3,
      name: "new",
      textColor: _.sample(textColors),
      cards: [
        {
          id: 9,
          title: "Define project milestones",
        },
        {
          id: 13,
          title: "Draft marketing strategy for product launch",
        },
      ],
    },
    {
      id: 4,
      name: "planned",
      textColor: _.sample(textColors),
      cards: [
        {
          id: 8,
          title: "Explore new design trends",
        },
        {
          id: 10,
          title: "Collaborate with team on feature planning",
        },
        {
          id: 14,
          title: "Research emerging technologies for future updates",
        },
      ],
    },
    {
      id: 5,
      name: "todo",
      textColor: _.sample(textColors),
      cards: [
        {
          id: 1,
          title: "Implement user authentication",
        },
        {
          id: 2,
          title: "Design homepage layout",
        },
        {
          id: 3,
          title: "Refactor backend API calls",
        },
      ],
    },
  ]);
  const [success, setSuccess] = useState("");

  const [showNewListInput, setShowNewListInput] = useState(false);
  const [newListName, setNewListName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setSuccess("");
    createList({ variables: { name: newListName } });
    setNewListName("");
    setShowNewListInput(false);
  };

  // useEffect(() => {
  //   if (!data) return;

  //   // setLists(
  //   //   data.lists.map((list) => ({ ...list, textColor: _.sample(textColors) })),
  //   // );
  // }, [data]);

  useEffect(() => {
    if (!success) return;

    // refetch();
  }, [success]);

  // useEffect(() => {
  //   if (!createdList) return;

  //   refetch();
  // }, [createdList]);

  return (
    <div className="flex h-full items-start justify-start overflow-scroll">
      <div className="flex flex-col space-y-4 p-4 md:flex-row md:space-x-4 md:space-y-0">
        {lists.map((list, index) => (
          <TaskContext.Provider key={"__list__" + index} value={setSuccess}>
            <List {...list} setLists={setLists} setSuccess={setSuccess} />
          </TaskContext.Provider>
        ))}
        <div className="h-fit min-w-[300px] rounded-md bg-slate-200 bg-opacity-90 p-4 shadow-md">
          <div className="inline-flex w-full items-center justify-between">
            <h2 className="title-2xl font-semibold">Add a list</h2>
            <ButtonWithIcon
              color={"bg-green-500"}
              hoverColor={"bg-green-600"}
              title={"Create List"}
              onClick={() => setShowNewListInput(true)}
              icon={faPlus}
            />
          </div>
          <RenderIf isTrue={showNewListInput}>
            <InputForm
              onSubmit={(e) => handleSubmit(e)}
              placeholder="Enter list name"
              onBlur={() => {
                setShowNewListInput(false);
                setNewListName("");
              }}
              onChange={(e) => setNewListName(e.target.value)}
              value={newListName}
            />
          </RenderIf>
        </div>
      </div>
    </div>
  );
};

export { TaskBoard, TaskContext };
