export type TKanbanData = "TO DO" | "IN PROGRESS" | "REVIEW" | "DONE";

export interface IKanbanSection {
  id: number;
  titleType: TKanbanData;
}

export interface IKanbanData {
  _id?: string;
  projectId: string;
  creator: string;
  assignedTo?: string;
  title: string;
  desc?: string;
  issuedDate: Date;
  dueDate?: Date;
  section: TKanbanData;
  comment?: string;
}

export interface IKanbanProject {
  projectId: string;
  name: string;
  establisher: string;
  establishDate: Date;
  status: string;
}
