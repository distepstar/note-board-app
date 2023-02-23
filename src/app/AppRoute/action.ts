import { createAction } from "@reduxjs/toolkit";
import { IRouteState } from "../../constants/Routes/interfaces";


export const changeRoute = createAction<IRouteState | undefined>('appRouter/changeRoute');
