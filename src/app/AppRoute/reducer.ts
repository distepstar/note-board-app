import { faBug } from "@fortawesome/free-solid-svg-icons";
import { createReducer } from "@reduxjs/toolkit";
import { IRouteState } from "../../constants/Routes/interfaces";
import { changeRoute } from "./action";

const initialState: IRouteState = {
  title: "Default",
  icon: faBug,
  endpoint: "/"
};

export const appRoute = createReducer(initialState, builder => {
  builder.addCase(changeRoute, (state, action) => {
    console.log(`Current route: ${action.payload?.endpoint}`)
    return action.payload;
  })
});
