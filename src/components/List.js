import React, { useMemo, useState } from "react"
import { useQuery, gql } from "@apollo/client"
import groupBy from "lodash/groupBy"
import startCase from "lodash/startCase"

const TaskBoard = () => {
  const GET_LOCATIONS = gql`
    query GetLocations {
      locations {
        id
        name
        description
        photo
      }
    }
  `
  const { loading, error, data } = useQuery(GET_LOCATIONS)
  console.log("data: ", data)

  const [tasks, setTasks] = useState([
    { id: 1, text: "Task 1", status: "todo" },
    { id: 2, text: "Task 2", status: "todo" },
    { id: 3, text: "Task 3", status: "todo" },
    { id: 4, text: "Task 4", status: "inProgress" },
    { id: 5, text: "Task 5", status: "inProgress" },
    { id: 6, text: "Task 6", status: "completed" },
    { id: 7, text: "Task 7", status: "completed" }
  ])

  const groupedTasks = useMemo(() => groupBy(tasks, "status"), [tasks])

  const moveTask = (id, status) => {
    const updatedTasks = tasks.map(task => (task.id === id ? { ...task, status } : task))
    setTasks(updatedTasks)
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex">
        {Object.entries(groupedTasks).map(([status, tasks]) => (
          <div key={"__" + status} className="w-1/3 bg-white rounded p-4 mr-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">{startCase(status)}</h2>
            <ul>
              {tasks.map(task => (
                <li key={task.id} className="mb-4 p-3 bg-gray-200 rounded flex justify-between items-center">
                  {task.text}
                  <button
                    onClick={() => moveTask(task.id, "inProgress")}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Start
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TaskBoard
