import React from "react";
import { NavLink } from "react-router-dom";

interface IProps {
  to: string;
  icon?: React.ReactNode;
  title: string;
}

export const NodeContainer: React.FC<IProps> = ({ to, icon, title }): JSX.Element => {

  const handleOnClick = () => {


  }

  return (
    <NavLink
      className={({ isActive }) =>
        isActive ?
          "node-container group flex flex-row space-x-4 justify-start place-items-center h-9 pl-4 cursor-pointer rounded-md bg-cyan-900 pr-4" 
          : 
          "node-container group flex flex-row space-x-4 justify-start place-items-center h-9 pl-4 cursor-pointer rounded-md hover:bg-cyan-900 pr-4"
      }
      to={to}
    >
      <div className="text-xl flex w-7 h-7 group-hover:rounded-md group-hover:bg-cyan-600 justify-center place-items-center">{icon}</div>
      <div className="node-title text-lg group-hover:underline whitespace-nowrap text-ellipsis">{title}</div>
    </NavLink>

  )
}
