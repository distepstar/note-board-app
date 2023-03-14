//react hook
import { memo, useContext, useEffect, useMemo, useState } from "react";
import { SortContext } from "../../routes/MainActivity/Projects";
// components
import { LoadingIcon } from "../LoadingIcon";
import { Pagination } from "../Pagination";
// utils
import { formateDate } from "../../utils/dateUtils";
import { dynamicSort } from "../../utils/commonUtils";
// fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleRight,
    faPlus,
    faSortDown,
    faSortUp,
} from "@fortawesome/free-solid-svg-icons";
//redux
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
    fetchKanbanQueryData,
    fetchProjectsQueryData,
} from "../../app/KanbanQuery";
// const
import { changeProject } from "../../app/KanbanProject/action";
import { IKanbanProject } from "../../constants/Kanban/interface";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { PopupWrapper } from "../Popup";

interface IProjectListWrapper { }

export const ProjectListWrapper: React.FC<
    IProjectListWrapper
> = (): JSX.Element => {
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState<number>(0);
    // redux hook
    const dispatch = useAppDispatch();
    const { projectsQueryData, status } = useAppSelector(
        (state) => state.kanbanQuerySlice
    );
    const sortInfo = useContext(SortContext);

    useEffect(() => {
        console.log(currentPage);
    }, [currentPage]);

    useEffect(() => {
        // refetch data every 20 second
        const intervalRefetch = setInterval(() => {
            console.log("refetch kanban project query data");
            dispatch(fetchProjectsQueryData());
        }, 20000);

        return () => {
            clearInterval(intervalRefetch);
        };
    }, [status]);

    // methods
    const filteredDataList = useMemo(() => {
        if (status === "loading" || status === "failed" || !projectsQueryData)
            return null;
        // data temp
        let temp = projectsQueryData;
        // default sort
        let field = "projectId";

        switch (sortInfo.currentSort) {
            case 0:
                field = "projectId";
            case 1:
                field = "name";
            case 2:
                field = "establisher";
            case 3:
                field = "establishDate";
            case 4:
                field = "status";
        }

        // set descending
        if (!sortInfo.isAscending) {
            field = `-${field}`;
        }

        // defrost in strict mode
        temp = temp.slice().sort(dynamicSort(field));

        // pagination
        const firstPageIndex = currentPage * itemsPerPage;
        const lastPageIndex = firstPageIndex + itemsPerPage;
        return temp.slice(firstPageIndex, lastPageIndex);
    }, [
        projectsQueryData,
        status,
        sortInfo.currentSort,
        sortInfo.isAscending,
        currentPage,
    ]);

    const handlePageChange = (e: React.MouseEvent, idx?: number) => {
        e.preventDefault();
        idx !== undefined && setCurrentPage(idx);
    };

    return (
        <Routes>
            <Route
                path={"/*"}
                element={
                    <div className="flex flex-col space-y-4 w-[98%] h-[35rem] justify-center place-items-center">
                        <Routes>
                            <Route path={"create/*"} element={<ProjectCreatePage />} />
                        </Routes>
                        <div className="flex flex-row w-full h-12 pl-4 pr-4 text-gray-700 space-x-4 justify-between place-items-center bg-white font-bold text-center rounded-sm">
                            <div className="w-2/12">ID</div>
                            <div className="w-6/12">Project Name</div>
                            <div className="w-4/12">Creator</div>
                            <div className="w-4/12">Establish Date</div>
                            <div className="w-2/12">Stage</div>
                        </div>

                        <div className="space-y-4 w-full h-full overflow-y-scroll">
                            {status === "loading" ? (
                                <LoadingIcon />
                            ) : (
                                filteredDataList?.map((ele, idx) => {
                                    return (
                                        <ProjectNode
                                            key={`project-${idx}`}
                                            projectId={ele.projectId}
                                            name={ele.name}
                                            establisher={ele.establisher}
                                            establishDate={ele.establishDate}
                                            status={ele.status}
                                        />
                                    );
                                })
                            )}
                        </div>

                        <Pagination
                            totalItems={projectsQueryData?.length}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            changePage={handlePageChange}
                        />
                    </div>
                }
            />
        </Routes>
    );
};

interface IProjectToolbar {
    handleCurrentSort: (e: React.MouseEvent, idx: number) => void;
}

interface IButtonList {
    name: string;
}
const buttonListInit: IButtonList[] = [
    { name: "ID" },
    { name: "Project Name" },
    { name: "Creator" },
    { name: "Establish Date" },
    { name: "Stage" },
];

export const ProjectToolbar: React.FC<IProjectToolbar> = ({
    handleCurrentSort,
}): JSX.Element => {
    const sortInfo = useContext(SortContext);

    return (
        <div className="flex flex-row w-[98%] justify-between place-items-center">
            <ProjectDropDown willRefethData={false} />
            <div className="flex flex-row justify-start place-items-center space-x-4">
                <div>Filter by:</div>

                {buttonListInit.map((ele, idx) => {
                    return (
                        <ProjectFilterBtn
                            key={`project-toolbar-btn-${idx}`}
                            name={ele.name}
                            idx={idx}
                            isActive={idx === sortInfo.currentSort}
                            isAscending={sortInfo.isAscending}
                            handleCurrentSort={handleCurrentSort}
                        />
                    );
                })}

                <div className="flex flex-row space-x-4 justify-center place-items-center w-56 h-14 rounded-md bg-blue-600">
                    <FontAwesomeIcon icon={faPlus} />
                    <Link to={"create"} relative="path">
                        Create New Project
                    </Link>
                </div>
            </div>
        </div>
    );
};

interface IProjectCreatePage { }

export const ProjectCreatePage: React.FC<IProjectCreatePage> = () => {
    const navi = useNavigate();

    useEffect(() => {
        // disable parent scroll action when pop-up
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflowY = "scroll";
        };
    }, []);

    // methods
    const handleCancel = (e: React.MouseEvent) => {
        e.preventDefault();
        navi("..");
    };

    return (
        <PopupWrapper>
            <div
                className="flex flex-col justify-center place-items-center w-full h-full bg-black/30"
                onClick={handleCancel}
            >
                <div
                    className="w-[55rem] h-[55rem] justify-start place-items-start bg-white rounded-md p-4 overflow-y-scroll no-scrollbar"
                    onClick={(e) => e.stopPropagation()}
                ></div>
            </div>
        </PopupWrapper>
    );
};

interface IProjectFilterBtn {
    name: string;
    idx: number;
    isActive: boolean;
    isAscending: boolean;
    handleCurrentSort: (e: React.MouseEvent, idx: number) => void;
}

export const ProjectFilterBtn: React.FC<IProjectFilterBtn> = ({
    name,
    idx,
    isActive,
    isAscending,
    handleCurrentSort,
}) => {
    return (
        <button
            className={`flex justify-center place-items-center rounded-md w-32 h-10 ${isActive ? "bg-blue-600" : "bg-blue-400"
                } hover:bg-blue-300`}
            onClick={(e) => handleCurrentSort(e, idx)}
        >
            <div className="flex flex-row justify-center place-items-center space-x-2">
                {isActive ? (
                    isAscending ? (
                        <FontAwesomeIcon className="pb-2" icon={faSortDown} />
                    ) : (
                        <FontAwesomeIcon className="pt-2" icon={faSortUp} />
                    )
                ) : null}
                <div>{name}</div>
            </div>
        </button>
    );
};

interface IProjectNode {
    projectId: string;
    name: string;
    establisher: string;
    establishDate: string;
    status: string;
}

export const ProjectNode: React.FC<IProjectNode> = ({
    projectId,
    name,
    establisher,
    establishDate,
    status,
}): JSX.Element => {
    const handleDateType = () => {
        return formateDate(new Date(establishDate));
    };

    return (
        <div className="flex flex-row w-full h-24 pl-4 pr-4 text-gray-700 space-x-4 justify-between place-items-center bg-white text-center rounded-sm">
            <div className="w-2/12">{projectId}</div>
            <div className="w-6/12">{name}</div>
            <div className="w-4/12">{establisher}</div>
            <div className="w-4/12">{handleDateType()}</div>
            <div className="w-2/12">{status}</div>
        </div>
    );
};

interface IProjectDropDown {
    willRefethData: boolean;
}

export const ProjectDropDown: React.FC<IProjectDropDown> = memo(
    ({ willRefethData }): JSX.Element => {
        const { projectsQueryData, status } = useAppSelector(
            (state) => state.kanbanQuerySlice
        );
        const dispatch = useAppDispatch();
        const currentProject = useAppSelector((state) => state.currentProject);
        // animation state
        const [expandDropdown, setExpandDropdown] = useState<boolean>(false);
        const [animationStart, setAnimationStart] = useState<boolean>(false);

        useEffect(() => {
            console.log(currentProject);
        }, []);

        // memoization
        const memoKanbanProject: IKanbanProject[] = useMemo(() => {
            if (!projectsQueryData) return [];
            return projectsQueryData.map((d: IKanbanProject) => ({
                ...d,
            }));
        }, [projectsQueryData]);

        const handleProjectChange = (
            e: React.MouseEvent,
            project: IKanbanProject,
            willRefethData: boolean
        ) => {
            e.preventDefault();
            dispatch(changeProject(project));
            willRefethData && dispatch(fetchKanbanQueryData());
            setExpandDropdown((prev) => (prev = !prev));
        };

        const handleExpandDropdown = (e: React.MouseEvent) => {
            e.preventDefault();
            setAnimationStart(true);
            setExpandDropdown((prev) => (prev = !prev));
        };

        return (
            <div className="kanban-dropdown-wrapper relative">
                <button
                    className="bg-blue-600 flex flex-row justify-start place-items-center gap-4 pl-4 w-40 h-9 rounded-md hover:bg-blue-400 font-bold"
                    onClick={(e) => handleExpandDropdown(e)}
                >
                    <FontAwesomeIcon
                        icon={faAngleRight}
                        className={`${animationStart
                            ? expandDropdown
                                ? "rotate-arrow-90"
                                : "rotate-arrow-0"
                            : ""
                            }`}
                    />
                    {<h1>{currentProject.name}</h1>}
                </button>
                <div
                    className={`absolute mt-1 bg-blue-600 w-60 rounded-md ${animationStart
                        ? expandDropdown
                            ? "fade-in"
                            : "fade-out"
                        : "opacity-0 hidden"
                        }`}
                >
                    <ul className="flex flex-col justify-center place-items-center space-y-1 pt-4 pb-4">
                        {memoKanbanProject?.map((el, idx) => {
                            return (
                                <li
                                    key={`kanban-dropdown-item-${idx}`}
                                    className={`w-10/12 border-b-[1px] border-b-white h-10 ${expandDropdown ? "cursor-pointer" : "pointer-events-none"
                                        }`}
                                    onClick={(e) => handleProjectChange(e, el, willRefethData)}
                                >
                                    <div className="flex justify-center place-items-center w-full h-8 hover:bg-blue-400 rounded-md">
                                        {el.name}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    }
);
