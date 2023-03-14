import React, { memo, useCallback, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// font awesome
import {
  faAdd,
  faBarsProgress,
  faFilter,
  faGear,
  faSearch,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
// components
import { KanbanManageButton, KanbanSection } from "../../../components/Kanban";
import { ProjectDropDown } from "../../../components/Project";
// react query
import { useMutation } from "react-query";
import { AxiosResponse } from "axios";
import { IResponse } from "../../../constants/apis";
// apis
import KanbanApi from "../../../apis/Kanban/";
// const
import {
  DragItemsType,
  TKanbanData,
  IKanbanData,
  IKanbanSection,
  sectionListInit,
} from "../../../constants/Kanban";
// css
import "./style.css";
import { IKanbanProject } from "../../../constants/Kanban/interface";
import { useNavigate } from "react-router-dom";
// redux
import { useAppSelector } from "../../../app/hooks";
import { throttle } from "lodash";

interface IProps {}

export const KanbanBoard: React.FC<IProps> = memo((): JSX.Element => {
  // redux hook
  const currentProject = useAppSelector((state) => state.currentProject);

  const { projectsQueryData, kanbanQueryData, status } = useAppSelector(
    (state) => state.kanbanQuerySlice
  );

  // navigation
  const navi = useNavigate();
  // data states
  const [kanbanSection, setkanbanSection] =
    useState<IKanbanSection[]>(sectionListInit);
  const [isAscending, setIsAscending] = useState<boolean>(true);

  const mutation = useMutation(KanbanApi.updateKanbanDataById, {
    onSuccess: (res: AxiosResponse<IResponse>) => {
      console.log(res.data.message);
    },
    onError: (err: any) => {
      console.error(err);
    },
  });

  // memoization
  const memoKanbanProject: IKanbanProject[] = useMemo(() => {
    if (!projectsQueryData) return [];
    return projectsQueryData.map((d: IKanbanProject) => ({
      ...d,
    }));
  }, [projectsQueryData]);

  const memoKanbanData: IKanbanData[] = useMemo(() => {
    if (!kanbanQueryData) return [];
    return kanbanQueryData.map((d) => ({
      ...d,
    }));
  }, [kanbanQueryData]);

  // render method
  const filteredData = useCallback(
    (section: TKanbanData) => {
      return (
        memoKanbanData && memoKanbanData.filter((e) => e.section === section)
      );
    },
    [kanbanQueryData]
  );

  // method
  const handleSectionSort = (e: React.MouseEvent) => {
    e.preventDefault();
    setkanbanSection((prev) =>
      prev.sort((a, b) => {
        return isAscending ? b.id - a.id : a.id - b.id;
      })
    );
    setIsAscending((prev) => !prev);
  };

  const createNewKanbanData = (e: React.MouseEvent) => {
    e.preventDefault();
    navi("create");
  };

  // handle expensive calls using throttle
  const throttleDropHandler = useCallback(
    (index: number, item: { itemIndex: string }) => {
      let throttled = throttle(handleDrop, 400);
      throttled(index, item);
    },
    [memoKanbanData]
  );

  const handleDrop = (index: number, item: { itemIndex: string }) => {
    const sectionTitle = kanbanSection[index].titleType;
    let data = [...(memoKanbanData as IKanbanData[])];
    let tempIdx = data.findIndex((el) => el._id === item.itemIndex);
    if (tempIdx === -1) {
      throw new TypeError("Value is empty");
    }
    data[tempIdx].section = sectionTitle;
    console.log(`Section: ${index}, item: ${item.itemIndex}`);
    // push changes to db
    mutation.mutate(data[tempIdx]);
  };

  return (
    <div className="relatve flex flex-col justify-start place-items-center w-full h-full pt-4 bg-zinc-600 text-white overflow-y-scroll no-scrollbar">
      <div className="kanban-header-wrapper w-full flex flex-col space-y-2 justify-between place-items-start pl-4 pr-4 pb-4">
        <h1 className="text-4xl font-bold h-[14rem]">Kanban Board</h1>
        <ProjectDropDown willRefethData={true} />
      </div>
      <div className="kanban-task-manage-wrapper bg-zinc-700 w-full min-h-screen">
        <div className="w-full h-full flex flex-col space-y-4 justify-start place-items-start">
          <div className="kanban-manage-bar flex flex-row justify-between place-items-center pl-4 pr-4 w-full">
            <div className="kanban-manage-title flex flex-row h-[4rem] justify-center place-items-center gap-4 text-xl font-bold">
              <FontAwesomeIcon icon={faBarsProgress} />
              <div>{currentProject?.name}</div>
            </div>
            <div className="kanban-manage-buttons-wrapper flex flex-row space-x-4">
              <KanbanManageButton
                icon={faAdd}
                title={"New Item"}
                customClass={"rounded-md bg-blue-400"}
                onClickEvent={createNewKanbanData}
              />
              <KanbanManageButton icon={faSearch} title={"Search"} />
              <KanbanManageButton icon={faFilter} title={"Filter"} />
              <KanbanManageButton
                icon={faSort}
                title={"Sort"}
                onClickEvent={handleSectionSort}
              />
              <KanbanManageButton icon={faGear} title={"Settings"} />
            </div>
          </div>
          <div className="kanban-manage-section-wrapper flex flex-row justify-start place-items-center space-x-8 w-full h-full pl-4 pr-4 pb-4">
            {kanbanSection.map((e, idx) => {
              return (
                <KanbanSection
                  key={`kanban-section-${e.titleType.trim().toLowerCase()}`}
                  accept={[
                    DragItemsType.TODO,
                    DragItemsType.REVIEW,
                    DragItemsType.INPROGRESS,
                    DragItemsType.DONE,
                  ]}
                  projectId={currentProject!.projectId}
                  titleType={e.titleType}
                  data={filteredData(e.titleType)}
                  isLoading={status === "loading"}
                  handleOnDrop={(item) => throttleDropHandler(idx, item)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});
