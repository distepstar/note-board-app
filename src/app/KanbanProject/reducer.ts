import { createReducer } from "@reduxjs/toolkit";
import { currentProjectInitState } from "../../constants/Kanban";
import { IKanbanProject } from "../../constants/Kanban/interface";
import { saveStateToSessionStorage } from "../../utils/persistent";
import { assignProjects, changeProject } from "./action";
import { throttle } from "lodash";


interface IKanbanProjectsStoreData {
  kanbanProjects: IKanbanProject[] | undefined;
}
const projectsInitState: IKanbanProjectsStoreData = {
  kanbanProjects: [],
}
// state for all projects
export const kanbanProjectsReducer = createReducer(projectsInitState, (builder) => {
  builder.addCase(assignProjects, (state, action) => {
    saveStateToSessionStorage('kanbanProjects', action.payload);
    state.kanbanProjects = action.payload;
  })
});
// state for currentProject
export const currentKanbanProjectReducer = createReducer(currentProjectInitState, (builder) => {
  builder.addCase(changeProject, (state, action) => {
    console.log("project changed!")
    saveStateToSessionStorage('currentProject', action.payload);
    return action.payload;
  })
});

