import { createAction } from '@reduxjs/toolkit';
import { IKanbanProject } from '../../constants/Kanban/interface';

export const assignProjects = createAction<IKanbanProject[] | undefined>('kanbanprojects/assign');
export const changeProject = createAction<IKanbanProject | undefined>('kanbanproject/change');
