import React from "react";
// react router
import { Outlet, Route, Routes } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconDefinition } from "@fortawesome/free-solid-svg-icons"
import { IRouteList } from "../../constants/Routes";
import { Calendar, Home, KanbanBoard, Notes } from "../../routes/MainActivity";

interface ITitleBarHeaderProps {
  title: string;
  icon: IconDefinition;
}

const TitleBarHeader: React.FC<ITitleBarHeaderProps> = ({ title, icon }): JSX.Element => {
  return (
    <div className="flex flex-row space-x-2 justify-center place-items-center group cursor-pointer">
      <div className="rounded-md w-6 h-6 bg-zinc-600 group hover text-center">
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="hover:underline underline-offset-2">{title}</div>
    </div>
  )
}


interface IProps {
  routeInfo: IRouteList;
}

export const Workplace: React.FC<IProps> = ({ routeInfo }): JSX.Element => {
  return (
    <div className="ml-[15%] w-[85%] h-full flex flex-col">
      <div className="flex flex-row flex-shrink-0 w-full h-10 bg-zinc-800 pl-4 pr-4 justify-between place-items-center text-white">
        <TitleBarHeader title={routeInfo.title} icon={routeInfo.icon} />
      </div>
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/calendar"} element={<Calendar />} />
        <Route path={"/notes"} element={<Notes />} />
        <Route path={"/kanbanboard/*"} element={<KanbanBoard />} />
      </Routes>
    </div>
  )
}

