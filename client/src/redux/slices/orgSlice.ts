import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../store"

const initialState = {
  value: "",
}

export const orgSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    setOrganization: (state, action: PayloadAction<string>) => {
      state.value = action.payload
    },
  },
})

export const { setOrganization } = orgSlice.actions

export const selectOrganization = (state: RootState) => state.organization.value

export default orgSlice.reducer
