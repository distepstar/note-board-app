import React, { useEffect, useRef, useState } from "react";
// css
import "./style.css";
// components
import { NodeContainer } from "./NodeContainer"
// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// const
import { routeListInit, IRouteList } from "../../constants/Routes";

interface IProps {

}


export const SideBar: React.FC<IProps> = (): JSX.Element => {
  const [routeList, setRouteList] = useState<IRouteList[]>(routeListInit)
  const [searchInput, setSearchInput] = useState<string>("");

  const filterRouteList = (): IRouteList[] => {
    const filterdList = routeList.filter((ele) => {
      if (searchInput === '') {
        return ele;
      }
      else {
        return ele.title.toLowerCase().includes(searchInput.toLowerCase());
      }
    })

    return filterdList
  }

  const renderRouteList = (callback: () => IRouteList[]) => {
    const renderList = callback().map((ele, idx) => {
      return (
        <NodeContainer key={`side-bar-nav-${idx}`}  icon={<FontAwesomeIcon icon={ele.icon} />} title={ele.title} to={ele.endpoint} />
      )
    })
    return renderList;
  }

  return ( 
    <div className="side-bar-container inline-block w-[15%] min-h-screen h-full fixed overflow-auto bg-stone-900">
      <div className="side-bar-wrapper text-white flex flex-col w-full justify-start place-items-center">
        <div className="side-bar-header-wrapper border-b-slate-500 border-b-2 pt-4 h-14">
          <div className="text-xl font-bold space-x-2 justify-center place-items-center">
            Note Board
          </div>
        </div>

        <div className="side-bar-search-bar">
          {/* TODO */}
        </div>
        <input className="rounded-md h-8 text-black pl-2" onChange={e => setSearchInput(e.target.value)} />

        <div className="side-bar-item-list flex flex-col space-y-2">
          {renderRouteList(filterRouteList)}
        </div>

      </div>
    </div>
  )
}

