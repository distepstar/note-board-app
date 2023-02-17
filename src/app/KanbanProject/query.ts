import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IKanbanProject } from "../../constants/Kanban/interface";

export const kanbanProjectApi = createApi({
  reducerPath: 'kanbanProjectApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5510/api/' }),
  endpoints: (builder) => ({
    getAllKanbanProject: builder.query<IKanbanProject[], void>({
      query: () => "kanbanboard/kanbanapi/kanbanproject",
    }),
  }),
})

export const { useGetAllKanbanProjectQuery } = kanbanProjectApi;

