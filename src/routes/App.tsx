import React, { useEffect } from "react";
import "./App.css";
// components
import { WorkplaceWrapper } from "../components/Workplace";
// React Dnd
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
// font awesome
// redux store
import { useAppDispatch } from "../app/hooks";
// redux action
import {
  fetchKanbanQueryData,
  fetchProjectsQueryData,
} from "../app/KanbanQuery";

const App: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  // react router dom

  useEffect(() => {
    stateInitialzeHandler();
  }, []);

  // method
  const stateInitialzeHandler = () => {
    // redux async thunk query
    dispatch(fetchProjectsQueryData()).then(() =>
      dispatch(fetchKanbanQueryData())
    );
  };

  return (
    <div className="app">
      <DndProvider backend={HTML5Backend}>
        <WorkplaceWrapper />
      </DndProvider>
    </div>
  );
};

export default App;
