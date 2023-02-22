import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { currentKanbanProjectReducer } from "./KanbanProject/reducer";
import kanbanQuerySlice from "./KanbanQuery";

export const store = configureStore({
  reducer: {
    kanbanQuerySlice,
    currentProject: currentKanbanProjectReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


