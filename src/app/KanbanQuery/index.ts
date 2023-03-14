import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { IKanbanData } from "../../constants/Kanban"
import { IKanbanProject } from "../../constants/Kanban/interface"
import { findAllKanbanProject, findKanbanDataByProjectId } from "../../apis/Kanban";
import { RootState } from "../store";
import { loadStateFromSessionStorage, saveStateToSessionStorage } from "../../utils/persistent";
import { changeProject } from "../KanbanProject/action";

interface QueryState {
  projectsQueryData: IKanbanProject[] | null;
  kanbanQueryData: IKanbanData[] | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: QueryState = {
  projectsQueryData: null,
  kanbanQueryData: null,
  status: 'idle',
  error: null
}

export const fetchProjectsQueryData = createAsyncThunk<IKanbanProject[], void, { state: RootState }>(
  'kanbanQuery/fetchProjectsQueryData',
  async (_, { getState, dispatch }) => {
    const data = await findAllKanbanProject() as IKanbanProject[];
    let { data: localData, success, error } = loadStateFromSessionStorage("currentProject");

    if (!success) {
      console.log("no current project persisted in storage");
      dispatch(changeProject(data[0]));
      saveStateToSessionStorage('currentProject', data[0]);
    } else {
      console.log("found current project persisted in storage")
      dispatch(changeProject(JSON.parse(localData) as IKanbanProject));
    }

    return data;
  }
);

export const fetchKanbanQueryData = createAsyncThunk<IKanbanData[], void, { state: RootState }>(
  'kanbanQuery/fetchKanbanQueryData',
  async (_, { getState }) => {
    const queryData = getState().kanbanQuerySlice.projectsQueryData;
    let { data, success, error } = loadStateFromSessionStorage("currentProject");
    let id = "";

    if (!success) {
      console.log("no current project persisted in storage");
      if (queryData && queryData?.length > 0) {
        id = queryData[0].projectId;
        console.log(id);
        saveStateToSessionStorage('currentProject', queryData[0]);
      }
    } else {
      console.log("found current project persisted in storage")
      id = (JSON.parse(data) as IKanbanProject).projectId;
    }

    const res = await findKanbanDataByProjectId(id) as IKanbanData[];

    return res;
  }
)

const kanbanQuerySlice = createSlice({
  name: 'kanbanQuery',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProjectsQueryData.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchProjectsQueryData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projectsQueryData = action.payload;
        console.log(action.payload);
        saveStateToSessionStorage("kanbanProjects", action.payload);
      })
      .addCase(fetchProjectsQueryData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message as string;
      })
      .addCase(fetchKanbanQueryData.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchKanbanQueryData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.kanbanQueryData = action.payload;
      })
      .addCase(fetchKanbanQueryData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message as string;
      })
  }
});

export const selectProjectsQueryData = (state: RootState) => state.kanbanQuerySlice.projectsQueryData;
export const selectKanbanQueryData = (state: RootState) => state.kanbanQuerySlice.kanbanQueryData;
export const selectQueryStatus = (state: RootState) => state.kanbanQuerySlice.status;
export const selectQueryError = (state: RootState) => state.kanbanQuerySlice.error;

export default kanbanQuerySlice.reducer;
