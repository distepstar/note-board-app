import { appApiClient } from "..";
import { IResponse } from "../../constants/apis";
import { IKanbanData } from "../../constants/Kanban";
import { IKanbanProject } from "../../constants/Kanban/interface"

export const findAllKanbanProject = async () => {
  const res = await appApiClient.get<IKanbanProject[]>("/kanbanboard/kanbanapi/kanbanproject");
  console.log(res.data);
  return res.data;
}

export const findAllKanbanData = async () => {
  const res = await appApiClient.get<IKanbanData[]>("/kanbanboard/kanbanapi/kanbandata");
  console.log(res.data);
  return res.data;
}

export const findKanbanDataByProjectId = async (projectId: string) => {
  const res = await appApiClient.get<IKanbanData[]>(`kanbanboard/kanbanapi/kanbandata/project/${projectId}`);
  return res.data;
}

export const findKanbanDataById = async (id: string) => {
  const res = await appApiClient.get<IKanbanData>(`kanbanboard/kanbanapi/kanbandata/${id}`);
  // console.log(res.data);
  return res.data;
}

export const createKanbanData = async (data: IKanbanData): Promise<any> => {
  console.log(data);
  let temp = data;
  let body = JSON.stringify(temp);

  const res = await appApiClient.post<IResponse>(`kanbanboard/kanbanapi/kanbandata/create`,
    body,
    {
      headers: {
        'Content-Type': 'application/json',
      }
    }
  ).catch(err => {
    console.error(err);
  });
  return res;
}

export const updateKanbanDataById = async (data: IKanbanData): Promise<any> => {
  let temp = data;

  const id = temp._id;
  // parss data to json
  let body = JSON.stringify(temp);

  const res = await appApiClient.put<IResponse>(`kanbanboard/kanbanapi/kanbandata/${id}`,
    body,
    {
      timeout: 3000,
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch(err => {
      console.error(err);
    });


  return res;
}

const KanbanApi = {
  findAllKanbanProject,
  findAllKanbanData,
  findKanbanDataByProjectId,
  findKanbanDataById,
  createKanbanData,
  updateKanbanDataById,
}

export default KanbanApi;
