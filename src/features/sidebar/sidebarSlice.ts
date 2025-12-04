import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface SidebarState {
  selected: string;
  openedDropdown: string | null;
}

const initialState: SidebarState = {
  selected: "",
  openedDropdown: null,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setSelected: (state, action: PayloadAction<string>) => {
      state.selected = action.payload;
    },
    setOpenedDropdown: (state, action: PayloadAction<string | null>) => {
      state.openedDropdown = action.payload;
    },
    toggleDropdown: (state, action: PayloadAction<string>) => {
      state.openedDropdown =
        state.openedDropdown === action.payload ? null : action.payload;
    },
  },
});

export const { setSelected, setOpenedDropdown, toggleDropdown } = sidebarSlice.actions;
export default sidebarSlice.reducer;
