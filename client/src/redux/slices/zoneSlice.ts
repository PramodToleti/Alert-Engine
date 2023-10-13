import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../store"

interface Zone {
  _id: string
  name: string
  org_id: string
}

const initialState = {
  zones: [] as Zone[],
}

export const zoneSlice = createSlice({
  name: "zones",
  initialState,
  reducers: {
    setZones: (state, action: PayloadAction<Zone[]>) => {
      state.zones = action.payload
    },
  },
})

export const { setZones } = zoneSlice.actions

export const selectZones = (state: RootState) => state.zones.zones


export default zoneSlice.reducer
