export type TKanbanData = "TO DO" | "IN PROGRESS" | "REVIEW" | "DONE";

export interface IKanbanSection {
  id: number;
  titleType: TKanbanData;
}

export interface IKanbanData {
  _id?: string;
  creator: string;
  assignedTo?: string;
  title: string;
  desc?: string;
  issuedDate: Date;
  dueDate?: Date;
  section: TKanbanData;
  comment?: string;
}
