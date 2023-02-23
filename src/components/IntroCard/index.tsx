import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

// components
import { IntroCardNote } from "./IntroCardNote";
// const
import { TKanbanData } from "../../constants/Kanban";

interface IProps {
  title?: string;
  section?: TKanbanData;
  issueDate?: string;
  dueDate?: string;
  desc?: string;
  icon?: IconDefinition;
  footnotes?: string[];
}

const colorList: string[] = ["bg-cyan-500", "bg-red-400", "bg-green-400", "bg-violet-500"];

export const IntroCard: React.FC<IProps> = ({ title, section, issueDate, dueDate, desc, icon, footnotes }): JSX.Element => {
  // get random bg color
  const [randomColor] = useState<string>(colorList[Math.floor(Math.random() * colorList.length)]);
  const [statusColor, setStatusColor] = useState<string>("bg-gray-300");

  // methods
  const changeStatusColor = () => {
    if (status === "REVIEW") {
      setStatusColor("bg-gray-300");
    } else if (status === "TO DO") {
      setStatusColor("bg-yellow-300");
    } else if (status === "IN PROGRESS") {
      setStatusColor("bg-indigo-500");
    } else if (status === "DONE") {
      setStatusColor("bg-green-200")
    }
  }

  useEffect(() => {
    changeStatusColor();
  }, [])

  return (
    <div className="home-highlight-wrapper inline-flex flex-col w-[24em] h-[25em] bg-white text-black justify-start place-items-center space-y-5 rounded-t-xl rounded-b-lg cursor-pointer">
      <div className={`home-highlight-header-wrapper flex flex-col space-y-4 w-full h-[17rem] justify-start place-items-center rounded-t-lg ${randomColor} `}>
        <div className="flex flex-row pt-6 w-11/12 h-[6rem] border-b-slate-700 border-b-4 justify-between place-items-center">
          <h1 className="text-4xl font-semibold text-left">
            {title}
          </h1>
          <div className="flex flex-col space-y-1 text-sm font-bold  place-items-end">
            <div className={`rounded-md w-max ${statusColor} pl-2 pr-2`}>
              {section}
            </div>
            <div className={`rounded-md w-max ${statusColor} pl-2 pr-2`}>
              Created: {issueDate}
            </div>
            <div className={`rounded-md w-max ${statusColor} pl-2 pr-2`}>
              Due Date: {dueDate}
            </div>
          </div>
        </div>
        <div className="home-highlight-body-wrapper flex flex-row  w-11/12 h-[9rem] rounded-md bg-white">
          <div className="home-hightlight-body pl-2 pt-2 text-left w-4/6 h-full overflow-x-hidden no-scrollbar ">
            {desc}
          </div>
          <div className="home-highlight-body-icon w-2/6 ml-1 flex flex-col justify-center place-items-center text-6xl border-l-4 border-l-slate-800 rounded-l-sm">
            {icon &&
              <FontAwesomeIcon icon={icon} />
            }
          </div>
        </div>
      </div>
      <div className="home-hightlight-footnotes-wrapper flex flex-row flex-wrap gap-4 w-full h-[6rem] pl-4 pb-8 justify-start place-items-center overflow-y-scroll no-scrollbar">
        {
          footnotes!.map((ele, idx) => {
            return (
              <IntroCardNote key={`home-hightlight-footnotes-node-${idx}`} text={`#${ele}`} />
            )
          })
        }
      </div>
    </div>
  )
}
