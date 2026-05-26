import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toasts: [],
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addToast: (state, action) => {
      state.toasts.push({
        id: Date.now() + Math.random().toString(36).substring(2, 9),
        type: action.payload.type || 'info',
        content: action.payload.content,
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = messageSlice.actions;
export default messageSlice.reducer;