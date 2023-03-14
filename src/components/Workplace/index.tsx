// react hook
import React, { useLayoutEffect } from "react";
// components
import { SideBar } from "../SideBar";
// react router
import { LoaderFunction, Outlet, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
// const
import { IRouteList, routeListInit } from "../../constants/Routes";
import { IKanbanProject } from "../../constants/Kanban/interface";
// apis
import KanbanApi from "../../apis/Kanban";
// react-query
import { QueryClient } from "react-query";
// redux hook
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { changeRoute } from "../../app/AppRoute/action";

interface ITitleBarHeaderProps {
  title: string;
  icon: IconDefinition;
}

const TitleBarHeader: React.FC<ITitleBarHeaderProps> = ({
  title,
  icon,
}): JSX.Element => {
  return (
    <div className="flex flex-row fixed w-full h-10 space-x-2 justify-start place-items-center group bg-zinc-800  pl-4 pr-4 z-50">
      <div className="rounded-md w-6 h-6 bg-zinc-600 group hover text-center">
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="hover:underline underline-offset-2">{title}</div>
    </div>
  );
};

// query
const findAllKanbanProjectQuery = () => ({
  queryKey: ["kanbanProject"],
  queryFn: async () => KanbanApi.findAllKanbanProject(),
});

export const projectLoader =
  (queryClient: QueryClient): LoaderFunction =>
  async (): Promise<IKanbanProject[]> => {
    const query = findAllKanbanProjectQuery();
    return (
      queryClient.getQueryData(query.queryKey) ??
      ((await queryClient.fetchQuery(query)) as IKanbanProject[])
    );
  };

interface IProps {
  routeInfo: IRouteList;
}

export const Workplace: React.FC<IProps> = ({ routeInfo }): JSX.Element => {
  return (
    <div className="ml-[15%] w-full h-full flex flex-col ">
      <div className="flex flex-row flex-shrink-0 w-full h-10 bg-zinc-800 justify-between place-items-center text-white">
        <TitleBarHeader title={routeInfo.title} icon={routeInfo.icon} />
      </div>
      <Outlet />
    </div>
  );
};

interface WorkplaceWrapper {}

export const WorkplaceWrapper: React.FC<WorkplaceWrapper> = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const appRoute = useAppSelector((state) => state.appRoute);
  const location = useLocation();

  const handleRouteInit = () => {
    const target = routeListInit.filter((ele) => {
      return ele.endpoint === location.pathname;
    });

    if (target && target.length === 1) {
      const temp = target[0];
      dispatch(changeRoute(temp));
    }
  };

  useLayoutEffect(() => {
    handleRouteInit();
  }, [location]);

  return (
    <div className="flex flex-row justify-start place-items-start h-full">
      <SideBar />
      <Workplace routeInfo={appRoute} />
    </div>
  );
};
