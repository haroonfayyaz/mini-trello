import "./App.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import logoImage from "./assets/images/logo.png";
import { TaskBoard } from "./components/TaskBoard";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-gray-100">
        <header className="flex h-fit items-center justify-start space-x-2 bg-cyan-500 px-4 py-1 text-4xl font-semibold text-blue-800">
          <img
            src={logoImage}
            alt="mini-trello"
            className="h-14 w-14 rounded-md"
          />
          <span>Mini Trello</span>
        </header>
        <TaskBoard />
      </div>
    </DndProvider>
  );
}

export default App;
