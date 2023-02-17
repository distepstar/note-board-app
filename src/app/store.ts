import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { kanbanProjectApi } from "./KanbanProject/query";
import { currentKanbanProjectReducer, kanbanProjectsReducer } from "./KanbanProject/reducer";

export const store = configureStore({
  reducer: {
    [kanbanProjectApi.reducerPath]: kanbanProjectApi.reducer,
    kanbanProjects: kanbanProjectsReducer,
    currentProject: currentKanbanProjectReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(kanbanProjectApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


