import { createReducer } from "@reduxjs/toolkit";
import { currentProjectInitState } from "../../constants/Kanban";
import { saveStateToSessionStorage } from "../../utils/persistent";
import { changeProject } from "./action";

// state for currentProject
export const currentKanbanProjectReducer = createReducer(currentProjectInitState, (builder) => {
  builder.addCase(changeProject, (state, action) => {
    console.log("project changed!")
    saveStateToSessionStorage('currentProject', action.payload);
    return action.payload;
  })
});

