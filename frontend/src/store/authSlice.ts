import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  token: string | null;
  user: { id: number; username: string; email: string; role: string } | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ token: string; id: number; username: string; email: string; role: string }>
    ) => {
      state.token = action.payload.token;
      state.user = {
        id: action.payload.id,
        username: action.payload.username,
        email: action.payload.email,
        role: action.payload.role,
      };
      state.isAuthenticated = true;
      state.error = null;
      state.isLoading = false;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    registerSuccess: (
      state,
      action: PayloadAction<{ token: string; id: number; username: string; email: string; role: string }>
    ) => {
      state.token = action.payload.token;
      state.user = {
        id: action.payload.id,
        username: action.payload.username,
        email: action.payload.email,
        role: action.payload.role,
      };
      state.isAuthenticated = true;
      state.error = null;
      state.isLoading = false;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setLoading, setError, loginSuccess, registerSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
