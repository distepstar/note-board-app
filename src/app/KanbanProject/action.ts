import { createAction } from '@reduxjs/toolkit';
import { IKanbanProject } from '../../constants/Kanban/interface';

export const changeProject = createAction<IKanbanProject | undefined>('kanbanproject/change');

