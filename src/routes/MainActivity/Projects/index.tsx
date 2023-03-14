import React, { createContext, useState } from "react";
// components
import { ProjectListWrapper, ProjectToolbar } from "../../../components/Project";

interface IProps { }

export const SortContext = createContext({ currentSort: 0, isAscending: false });

export const Projects: React.FC<IProps> = (): JSX.Element => {
  const [currentSort, setCurrentSort] = useState<number>(0);
  const [isAscending, setIsAscending] = useState<boolean>(true);


  const handleCurrentSort = (e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    if (idx === currentSort) {
      setIsAscending(prev => !prev);
    } else {
      setIsAscending(true);
      // change sort index 
      setCurrentSort(idx);
    }
  }
  return (
    <div className="flex flex-col justify-start place-items-center w-full h-full pb-4 bg-zinc-600 text-white">
      <div className="flex flex-col space-y-4 place-self-start w-full pt-4 h-[12em] bg-zinc-700">
        <div className="ml-4 mr-4 font-bold text-left text-4xl border-b-slate-500 border-b-2 h-14">
          Projects
        </div>
      </div>

      <div className="flex flex-col space-y-4 relative justify-center place-items-center w-full h-full">
        <div className="flex flex-row space-x-4 absolute left-[0.8rem] top-[-3.0rem]">
          <div className="flex justify-center place-items-center w-40 h-12 bg-blue-600 rounded-t-md">My Project</div>
          <div className="flex justify-center place-items-center w-40 h-12 bg-blue-400 rounded-t-md">My Project</div>
        </div>

        <SortContext.Provider value={{ currentSort: currentSort, isAscending: isAscending }}>
          <ProjectToolbar handleCurrentSort={handleCurrentSort} />
          <ProjectListWrapper />
        </SortContext.Provider>
      </div>
    </div>
  )
}

