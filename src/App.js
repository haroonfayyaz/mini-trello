import "./App.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useState } from "react";
import Header from "./components/Header";
import Spinner from "./components/Spinner";
import SpinnerContext from "./contexts/SpinnerContext";
import TaskBoard from "./components/TaskBoard";

function App() {
  const [showSpinner, setShowSpinner] = useState(false);

  return (
    <DndProvider backend={HTML5Backend}>
      <Spinner visible={showSpinner} />
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-gray-100">
        <Header />
        <SpinnerContext.Provider value={setShowSpinner}>
          <TaskBoard />
        </SpinnerContext.Provider>
      </div>
    </DndProvider>
  );
}

export default App;
