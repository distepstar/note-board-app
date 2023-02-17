import React, { useEffect, useState } from "react";
import "./App.css";
// react router
import { useLocation } from "react-router-dom";
// components
import { Workplace } from "../components/Workplace";
import { SideBar } from "../components/SideBar";
// const
import { IRouteList, routeListInit } from "../constants/Routes";
// React Dnd
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
// font awesome
import { faBug } from "@fortawesome/free-solid-svg-icons";
// redux store
import { useGetAllKanbanProjectQuery } from "../app/KanbanProject/query";
import { useAppDispatch } from "../app/hooks";
import { changeProject, assignProjects } from "../app/KanbanProject/action";
import { ISessionStorageState, loadStateFromSessionStorage, saveStateToSessionStorage } from "../utils/persistent";
import { IKanbanProject } from "../constants/Kanban/interface";

const App: React.FC = (): JSX.Element => {

  // redux hook
  const { data, error, isLoading } = useGetAllKanbanProjectQuery();
  const dispatch = useAppDispatch();
  // react router dom
  const location = useLocation();

  const [routeInfo, setRouteInfo] = useState<IRouteList>({
    title: "Dummy",
    icon: faBug,
    endpoint: "/"
  });


  useEffect(() => {
    console.log(data);
    if (!isLoading && data) {
      handleDispatchProjects(data);
    }
  }, [data])

  useEffect(() => {
    handleRouteChange();
  }, [location.pathname])

  // methods
  const handleDispatchProjects = (data: IKanbanProject[]) => {
    // assign all projects to global state
    // dispatch to redux store
    dispatch(assignProjects(data));
    // set current project, check if current project is in session storage
    const { data: currentData, success, error } = loadStateFromSessionStorage('currentProject');
    error && console.error(error);

    let temp:IKanbanProject = data[0];
    temp = success ? JSON.parse(currentData) as IKanbanProject : temp;
    // dispatch to redux store
    dispatch(changeProject(temp));
  }

  // passing route infos (e.g. icon, title, endpoint) to derived components
  const handleRouteChange = () => {
    routeListInit.map(ele => {
      if (ele.endpoint === location.pathname) {
        setRouteInfo({ title: ele.title, icon: ele.icon, endpoint: ele.endpoint });
      }
    })
  }

  return (
    <div className="app">
      <DndProvider backend={HTML5Backend}>
        {
          isLoading ?
            <div className="w-full h-full flex justify-center place-items-center bg-black">
              <svg className="w-12 h-12 animate-spin text-indigo-400" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4.75V6.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"></path>
                <path d="M17.1266 6.87347L16.0659 7.93413" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M19.25 12L17.75 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"></path>
                <path d="M17.1266 17.1265L16.0659 16.0659" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M12 17.75V19.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"></path>
                <path d="M7.9342 16.0659L6.87354 17.1265" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M6.25 12L4.75 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"></path>
                <path d="M7.9342 7.93413L6.87354 6.87347" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
            :
            <div className="flex flex-row justify-start place-items-start h-full">
              <SideBar />
              <Workplace routeInfo={routeInfo} />
            </div>
        }
      </DndProvider>
    </div>
  )
}

export default App;
