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
import { fetchKanbanQueryData, fetchProjectsQueryData } from "../app/KanbanQuery";
import { changeProject } from "../app/KanbanProject/action";
// persistent
import { loadStateFromSessionStorage } from "../utils/persistent";

const App: React.FC = (): JSX.Element => {

  // persistent
  const { data: currentProjectFromSession } = loadStateFromSessionStorage('currentProject');

  const dispatch = useAppDispatch();
  // react router dom

  useEffect(() => {
    stateInitialzeHandler();
  }, [])

  // method
  const stateInitialzeHandler = () => {
    // redux async thunk query
    dispatch(fetchProjectsQueryData())
      .then(() =>
        dispatch(fetchKanbanQueryData()))
      .then(() =>
        dispatch(changeProject(JSON.parse(currentProjectFromSession)))
      );
  }

  return (
    <div className="app">
      <DndProvider backend={HTML5Backend}>
        <WorkplaceWrapper />
      </DndProvider>
    </div>
  )
}

export default App;
