import React from "react";
// redux hook
import { useAppSelector } from "../../../app/hooks";
import { useGetAllKanbanProjectQuery } from "../../../app/KanbanProject/query";
// components
import { LoadingIcon } from "../../../components/LoadingIcon";
// font awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { formateDate } from "../../../utils/dateUtils";

interface IProps {

}
export const Projects: React.FC<IProps> = (): JSX.Element => {
  const currentProject = useAppSelector(state => state.currentProject);
  const { data, isLoading, isError } = useGetAllKanbanProjectQuery();

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

        <div className="flex flex-row w-[98%] justify-between place-items-center">
          <div className="font-bold text-2xl">{currentProject.name}</div>
          <div className="flex flex-row justify-start place-items-center space-x-4">
            <div>Filter by:</div>
            <h1 className="flex justify-center place-items-center bg-blue-600 rounded-md w-24 h-10">Date</h1>
            <h1 className="flex justify-center place-items-center bg-blue-400 rounded-md w-24 h-10">Creator</h1>
            <h1 className="flex justify-center place-items-center bg-blue-400 rounded-md w-24 h-10">Name</h1>
            <div className="flex flex-row space-x-4 justify-center place-items-center w-60 h-14 rounded-md bg-blue-600">
              <FontAwesomeIcon icon={faPlus} />
              <div>Create New Project</div>
            </div>
          </div>
        </div>

        <div className="space-y-4 w-[98%] min-h-[35rem] overflow-y-scroll">
          <div className="flex flex-row w-full h-12 pl-4 pr-4 text-gray-700 space-x-4 justify-between place-items-center bg-white font-bold text-center">
            <div className="w-2/12">ID</div>
            <div className="w-6/12">Project</div>
            <div className="w-4/12">Creator</div>
            <div className="w-4/12">Establish Date</div>
            <div className="w-2/12">Stage</div>
          </div>
          {
            isLoading ? <LoadingIcon />
              :
              data?.map((ele, idx) => {
                return (
                  <div key={`project-${idx}`} className="flex flex-row w-full h-24 pl-4 pr-4 text-gray-700 space-x-4 justify-between place-items-center bg-white font-bold text-center">
                    <div className="underline w-2/12">{ele.projectId}</div>
                    <div className="underline w-6/12">{ele.name}</div>
                    <div className="underline w-4/12">{ele.establisher}</div>
                    <div className="underline w-4/12">{formateDate(new Date(ele.establishDate))}</div>
                    <div className="underline w-2/12">{ele.status}</div>
                  </div>
                )
              })
          }
        </div>
      </div>
    </div>
  )
}

