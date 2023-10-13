import { configureStore } from "@reduxjs/toolkit"
import orgReducer from "./slices/orgSlice"
import zoneReducer from "./slices/zoneSlice"
import siteReducer from "./slices/siteSlice"

export const store = configureStore({
  reducer: {
    organization: orgReducer,
    zones: zoneReducer,
    sites: siteReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
