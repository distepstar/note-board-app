import * as route from "./interfaces";
import { faHouse, faClipboard, faCalendarDay, faBookmark, faProjectDiagram } from "@fortawesome/free-solid-svg-icons"

// interface
export type IRouteList = route.IRouteState;


// init data
export const routeListInit: IRouteList[] = [
  {
    icon: faHouse,
    title: "Home",
    endpoint: "/"
  },
  {
    icon: faProjectDiagram,
    title: "Projects",
    endpoint: "/projects"
  },
  {
    icon: faCalendarDay,
    title: "Calendar",
    endpoint: "/calendar"
  },
  {
    icon: faClipboard,
    title: "Notes",
    endpoint: "/notes"
  },
  {
    icon: faBookmark,
    title: "Kanban Board",
    endpoint: "/kanbanboard"
  },
]

