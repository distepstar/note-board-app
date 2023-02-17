import { TKanbanData, IKanbanSection, IKanbanProject } from "./interface";
import {DragItemsType} from "./drag";
export { DragItemsType } from "./drag";
export type { TKanbanData, IKanbanSection, IKanbanData } from "./interface";

export const currentProjectInitState: IKanbanProject = {
  projectId: "default",
  name: "Loading......",
  establisher: "default",
  establishDate: "",
  status: "TO DO"
} as IKanbanProject;

export const sectionListInit: IKanbanSection[] = [
  {id: 0, titleType: DragItemsType.TODO },
  {id: 1, titleType: DragItemsType.INPROGRESS },
  {id: 2, titleType: DragItemsType.REVIEW },
  {id: 3, titleType: DragItemsType.DONE },
]
