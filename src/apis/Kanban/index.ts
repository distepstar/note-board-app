import { appApiClient } from "..";
import { IResponse } from "../../constants/apis";
import { IKanbanData } from "../../constants/Kanban";


export const findAllKanbanData = async () => {
  const res = await appApiClient.get<IKanbanData[]>("/kanbanboard/kanbanapi");
  // console.log(res.data);
  return res.data;
}


export const findKanbanDataById = async (id: string) => {
  const res = await appApiClient.get<IKanbanData>(`kanbanboard/kanbanapi/${id}`);
  // console.log(res.data);
  return res.data;
}

export const updateKanbanDataById = async (data: IKanbanData): Promise<any> => {
  let temp = data;

  const id = temp._id;
  // parss data to json
  let body = JSON.stringify(temp);

  const res = await appApiClient.post<IResponse>(`kanbanboard/kanbanapi/${id}`,
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
  findAllKanbanData,
  findKanbanDataById,
  updateKanbanDataById,
}

export default KanbanApi;
