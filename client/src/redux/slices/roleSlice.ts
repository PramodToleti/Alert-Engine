import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../store"

interface Role {
  _id: string
  role_name: string
}

const initialState = {
  roles: [] as Role[],
}

export const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    setRoles: (state, action: PayloadAction<Role[]>) => {
      state.roles = action.payload
    },
  },
})

export const { setRoles } = roleSlice.actions

export const selectRoles = (state: RootState) => state.roles.roles

export default roleSlice.reducer
