import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { apiBaseURI } from "../../constants/apis";
import { IKanbanProject } from "../../constants/Kanban/interface";


export const kanbanProjectApi = createApi({
  reducerPath: 'KanbanProjectApi',
  baseQuery: fetchBaseQuery({baseUrl: `${apiBaseURI}`}),
  endpoints: (builder) => ({
    getAllKanbanProject: builder.query<IKanbanProject[], void>({
      query: () => '/kanbanboard/kanbanapi/kanbanproject',
    }),
  }),
})


export const {useGetAllKanbanProjectQuery} = kanbanProjectApi;

