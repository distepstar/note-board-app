import * as route from "./interfaces";
import { faHouse, faClipboard, faCalendarDay, faBookmark } from "@fortawesome/free-solid-svg-icons"

// interface
export type IRouteList = route.IRouteList;


// init data
export const routeListInit: IRouteList[] = [
  {
    icon: faHouse,
    title: "Home",
    endpoint: "/"
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

