import { createSlice } from "@reduxjs/toolkit";

const userInfoFromLocalStorage = localStorage.getItem('userInfo');
const adminInfoFromLocalStorage = localStorage.getItem('adminInfo');

const initialState = {
  userLoggedIn: localStorage.getItem('userLoggedIn') ? true : false,
  userInfo: userInfoFromLocalStorage ? JSON.parse(userInfoFromLocalStorage) : null,
  adminLoggedIn: localStorage.getItem('adminLoggedIn') ? true : false,
  adminInfo: adminInfoFromLocalStorage ? JSON.parse(adminInfoFromLocalStorage) : null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userLoggedIn = true
      localStorage.setItem('userLoggedIn', 'true')
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userLoggedIn = false;
      state.userInfo = null;
      localStorage.removeItem('userLoggedIn')
      localStorage.removeItem('userInfo')

      state.adminLoggedIn = false;
      localStorage.removeItem('adminLoggedIn');
      state.adminInfo = null;
      localStorage.removeItem("adminInfo");
    },
    setAdminCredentials: (state, action) => {
      state.adminLoggedIn = true;
      state.adminInfo = action.payload;
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem("adminInfo", JSON.stringify(action.payload));
    }
  }
})

export const {
  setCredentials,
  logout,
  setAdminCredentials,
} = authSlice.actions;

export default authSlice.reducer;