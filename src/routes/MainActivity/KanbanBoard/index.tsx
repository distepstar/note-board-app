import React, { memo, useCallback, useMemo, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// font awesome
import { faAdd, faAngleRight, faBarsProgress, faFilter, faGear, faSearch, faSort } from "@fortawesome/free-solid-svg-icons"
// components
import { KanbanManageButton, KanbanSection } from "../../../components/Kanban";
// react query
import { useMutation, useQuery, } from "react-query";
import { AxiosResponse } from "axios";
import { IResponse } from "../../../constants/apis";
import KanbanApi from "../../../apis/Kanban/";
// const
import { DragItemsType, TKanbanData, IKanbanData, IKanbanSection, sectionListInit } from "../../../constants/Kanban";

// css
import "./style.css";
import { IKanbanProject } from "../../../constants/Kanban/interface";
import { useNavigate } from "react-router-dom";

interface IProps {

}

export const KanbanBoard: React.FC<IProps> = memo((): JSX.Element => {
  // navigation

  const navi = useNavigate();
  // animation state
  const [expandDropdown, setExpandDropdown] = useState<boolean>(false);
  const [animationStart, setAnimationStart] = useState<boolean>(false);

  // data states
  const [currentProject, setCurrentProject] = useState<IKanbanProject | null>(null);
  const [kanbanSection, setkanbanSection] = useState<IKanbanSection[]>(sectionListInit);
  const [isAscending, setIsAscending] = useState<boolean>(true);

  // api calls
  const { isLoading: projectLoading, data: kanbanProjectData, error: projectError } = useQuery<IKanbanProject[], Error>(['kanbanProject',], async () => {
    return await KanbanApi.findAllKanbanProject();
  }, {
    onSuccess: (data) => {
      console.log("Kanban project refetch invoke!");
      setCurrentProject(data[0]);
    },
    onError: (err: any) => {
      console.error(err);
    }
  })

  // fetch kanban data after fetching project data
  const { isLoading: kanbanDataLoading, data: kanbanData, error: kanbanError } = useQuery<IKanbanData[], Error>(['kanbanData', currentProject], async () => {
    return await KanbanApi.findKanbanDataByProjectId(currentProject?.projectId as string);
  }, {
    enabled: !!currentProject?.projectId,
    onSuccess: () => {
      console.log("Kanban data refetch invoke!")
    }
  });

  const mutation = useMutation(KanbanApi.updateKanbanDataById, {
    onSuccess: (res: AxiosResponse<IResponse>) => {
      console.log(res.data.message);
    },
    onError: (err: any) => {
      console.error(err);
    },
  })

  // memoization
  const memoKanbanProject: IKanbanProject[] = useMemo(() => {
    if (!kanbanProjectData) return [];
    return kanbanProjectData.map((d) => ({
      ...d,
    }));
  }, [kanbanProjectData])

  const memoKanbanData: IKanbanData[] = useMemo(() => {
    if (!kanbanData) return [];
    return kanbanData.map((d) => ({
      ...d,
    }));
  }, [kanbanData]);

  // render method
  const filteredData = useCallback((section: TKanbanData) => {
    return memoKanbanData && memoKanbanData.filter(e => e.section === section);
  }, [memoKanbanData]);


  const handleSectionSort = (e: React.MouseEvent) => {
    e.preventDefault();
    setkanbanSection(prev => prev.sort((a, b) => {
      return isAscending ? b.id - a.id : a.id - b.id;
    }))
    setIsAscending(prev => !prev);
  }

  // method
  const createNewKanbanData = (e: React.MouseEvent) => {
    e.preventDefault();
    navi("create");
  }

  const handleProjectChange = (e: React.MouseEvent, project: IKanbanProject) => {
    e.preventDefault();
    setCurrentProject(project);
    setExpandDropdown(prev => prev = !prev);
  }

  const handleExpandDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setAnimationStart(true);
    setExpandDropdown(prev => prev = !prev);
  }

  const handleDrop = useCallback((index: number, item: { itemIndex: string }) => {
    const sectionTitle = kanbanSection[index].titleType;
    let data = [...(memoKanbanData as IKanbanData[])];
    let tempIdx = data.findIndex(el => el._id === item.itemIndex);
    if (tempIdx === -1) {
      throw new TypeError("Value is empty");
    }
    data[tempIdx].section = sectionTitle;
    console.log(`Section: ${index}, item: ${item.itemIndex}`)
    // push changes to db
    mutation.mutate(data[tempIdx]);

  }, [memoKanbanData])

  return (
    <div className="relatve flex flex-col justify-start place-items-center w-full pt-4 bg-zinc-600 text-white">
      <div className="kanban-header-wrapper w-full h-[14rem] flex flex-col space-y-2 justify-between place-items-start pl-4 pr-4 pb-4">
        <h1 className="text-4xl font-bold">Kanban Board</h1>
        {
          projectLoading ?
            <div className="w-full h-full flex justify-center place-items-center">
              <svg className="w-12 h-12 animate-spin text-indigo-400" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4.75V6.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"></path>
                <path d="M17.1266 6.87347L16.0659 7.93413" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M19.25 12L17.75 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"></path>
                <path d="M17.1266 17.1265L16.0659 16.0659" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M12 17.75V19.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"></path>
                <path d="M7.9342 16.0659L6.87354 17.1265" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M6.25 12L4.75 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"></path>
                <path d="M7.9342 7.93413L6.87354 6.87347" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
            :
            <div className="kanban-dropdown-wrapper relative">
              <button className="bg-blue-600 flex flex-row justify-start place-items-center gap-4 pl-4 w-40 h-9 rounded-md hover:bg-blue-400 font-bold" onClick={e => handleExpandDropdown(e)}>
                <FontAwesomeIcon icon={faAngleRight} className={`${animationStart ? expandDropdown ? 'rotate-arrow-90' : 'rotate-arrow-0' : ''}`} />
                <h1>{currentProject?.name}</h1>
              </button>
              <div className={`absolute mt-1 bg-blue-600 w-60 rounded-md ${animationStart ? expandDropdown ? 'fade-in' : 'fade-out' : 'opacity-0 hidden'}`}>
                <ul className="flex flex-col justify-center place-items-center space-y-1 pt-4 pb-4">
                  {
                    memoKanbanProject?.map((el, idx) => {
                      return (
                        <li key={`kanban-dropdown-item-${idx}`} className={`w-10/12 border-b-[1px] border-b-white h-10 ${expandDropdown ? 'cursor-pointer' : 'pointer-events-none'}`} onClick={e => handleProjectChange(e, el)}>
                          <div className="flex justify-center place-items-center w-full h-8 hover:bg-blue-400 rounded-md">{el.name}</div>
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
            </div>
        }
      </div>
      <div className="kanban-task-manage-wrapper bg-zinc-700 w-full min-h-screen">
        {
          projectLoading ?
            <div className="w-full h-full flex justify-center place-items-center">
              <svg className="w-12 h-12 animate-spin text-indigo-400" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4.75V6.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"></path>
                <path d="M17.1266 6.87347L16.0659 7.93413" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M19.25 12L17.75 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"></path>
                <path d="M17.1266 17.1265L16.0659 16.0659" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M12 17.75V19.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"></path>
                <path d="M7.9342 16.0659L6.87354 17.1265" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M6.25 12L4.75 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"></path>
                <path d="M7.9342 7.93413L6.87354 6.87347" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
            :
            <div className="w-full h-full flex flex-col space-y-4 justify-start place-items-start">
              <div className="kanban-manage-bar flex flex-row justify-between place-items-center pl-4 pr-4 w-full h-[4rem]">
                <div className="kanban-manage-title flex flex-row justify-center place-items-center gap-4 text-xl font-bold">
                  <FontAwesomeIcon icon={faBarsProgress} />
                  <div>{currentProject?.name}</div>
                </div>
                <div className="kanban-manage-buttons-wrapper flex flex-row space-x-4">
                  <KanbanManageButton icon={faAdd} title={"New Item"} customClass={"rounded-md bg-blue-400"} onClickEvent={createNewKanbanData} />
                  <KanbanManageButton icon={faSearch} title={"Search"} />
                  <KanbanManageButton icon={faFilter} title={"Filter"} />
                  <KanbanManageButton icon={faSort} title={"Sort"} onClickEvent={handleSectionSort} />
                  <KanbanManageButton icon={faGear} title={"Settings"} />
                </div>
              </div>
              <div className="kanban-manage-section-wrapper flex flex-row justify-start place-items-center space-x-8 w-full h-full pl-4 pr-4 pb-4">
                {
                  !projectLoading &&
                  kanbanSection.map((e, idx) => {
                    return (
                      <KanbanSection
                        key={`kanban-section-${e.titleType.trim().toLowerCase()}`}
                        accept={[DragItemsType.TODO, DragItemsType.REVIEW, DragItemsType.INPROGRESS, DragItemsType.DONE]}
                        projectId={currentProject!.projectId}
                        titleType={e.titleType}
                        data={filteredData(e.titleType)}
                        isLoading={kanbanDataLoading}
                        handleOnDrop={(item) => handleDrop(idx, item)}
                      />
                    )
                  })
                }
              </div>

            </div>
        }
      </div>
    </div>
  )
})

