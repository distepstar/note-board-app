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

const App: React.FC = (): JSX.Element => {
  const location = useLocation();
  const [routeInfo, setRouteInfo] = useState<IRouteList>({
    title: "Dummy",
    icon: faBug,
    endpoint: "/"
  });

  // passing route infos (e.g. icon, title, endpoint) to derived components
  const handleRouteChange = () => {
    routeListInit.map(ele => {
      if (ele.endpoint === location.pathname) {
        setRouteInfo({ title: ele.title, icon: ele.icon, endpoint: ele.endpoint });
      }
    })
  }

  useEffect(() => {
    handleRouteChange();
  }, [location.pathname])

  return (
    <div className="app">
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-row justify-start place-items-start h-full">
          <SideBar />
          <Workplace routeInfo={routeInfo} />
        </div>
      </DndProvider>
    </div>
  )
}

export default App;
