import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
// reducers
import { appRoute } from "./AppRoute/reducer";
import { currentKanbanProjectReducer } from "./KanbanProject/reducer";
// slices
import kanbanQuerySlice from "./KanbanQuery";

export const store = configureStore({
  reducer: {
    kanbanQuerySlice,
    appRoute: appRoute,
    currentProject: currentKanbanProjectReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
