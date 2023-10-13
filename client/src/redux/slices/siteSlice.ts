import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../store"

interface Site {
  _id: string
  site_name: string
  org_id: string
  zone_id: string
}

const initialState = {
  sites: [] as Site[],
}

export const siteSlice = createSlice({
  name: "sites",
  initialState,
  reducers: {
    setSites: (state, action: PayloadAction<Site[]>) => {
      state.sites = action.payload
    },
  },
})

export const { setSites } = siteSlice.actions

export const selectZones = (state: RootState) => state.zones.zones

export default siteSlice.reducer
