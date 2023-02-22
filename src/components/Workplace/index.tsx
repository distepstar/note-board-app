import React, { useEffect, useState } from "react";
// react router
import { LoaderFunction, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBug, IconDefinition } from "@fortawesome/free-solid-svg-icons"
// const
import { IRouteList, routeListInit } from "../../constants/Routes";
// apis
import KanbanApi from "../../apis/Kanban";
import { QueryClient } from "react-query";
import { IKanbanProject } from "../../constants/Kanban/interface";
import { SideBar } from "../SideBar";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchKanbanQueryData } from "../../app/KanbanQuery";
import { loadStateFromSessionStorage } from "../../utils/persistent";

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

// query
const findAllKanbanProjectQuery = () => ({
  queryKey: ['kanbanProject'],
  queryFn: async () => KanbanApi.findAllKanbanProject(),
});

export const projectLoader = (queryClient: QueryClient): LoaderFunction =>
  async (): Promise<IKanbanProject[]> => {
    const query = findAllKanbanProjectQuery();
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query)) as IKanbanProject[]
    )
  }

export const Workplace: React.FC<IProps> = ({ routeInfo }): JSX.Element => {

  return (
    <div className="ml-[15%] w-[85%] h-full flex flex-col">
      <div className="flex flex-row flex-shrink-0 w-full h-10 bg-zinc-800 pl-4 pr-4 justify-between place-items-center text-white">
        <TitleBarHeader title={routeInfo.title} icon={routeInfo.icon} />
      </div>
      <Outlet />
    </div>
  )
}

interface WorkplaceWrapper {
}

export const WorkplaceWrapper: React.FC<WorkplaceWrapper> = (): JSX.Element => {
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
    <div className="flex flex-row justify-start place-items-start h-full">
      <SideBar />
      <Workplace routeInfo={routeInfo} />
    </div>
  )

}

