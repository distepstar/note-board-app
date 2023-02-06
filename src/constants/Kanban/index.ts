import { TKanbanData, IKanbanSection } from "./interface";
import {DragItemsType} from "./drag";
export { DragItemsType } from "./drag";
export type { TKanbanData, IKanbanSection, IKanbanData } from "./interface";

export const sectionListInit: IKanbanSection[] = [
  {id: 0, titleType: DragItemsType.TODO },
  {id: 1, titleType: DragItemsType.INPROGRESS },
  {id: 2, titleType: DragItemsType.REVIEW },
  {id: 3, titleType: DragItemsType.DONE },
]
