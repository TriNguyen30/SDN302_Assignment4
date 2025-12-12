import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../lib/axios";
import type { Quiz } from "../../types/api";

interface QuizState {
  items: Quiz[];
  current: Quiz | null;
  loading: boolean;
  error: string | null;
}

const initialState: QuizState = {
  items: [],
  current: null,
  loading: false,
  error: null,
};

export const fetchQuizzes = createAsyncThunk("quizzes/fetchAll", async () => {
  const { data } = await axios.get<Quiz[]>("/quizzes");
  return data;
});

export const fetchQuizById = createAsyncThunk("quizzes/fetchById", async (id: string) => {
  const { data } = await axios.get<Quiz>(`/quizzes/${id}`);
  return data;
});

const quizSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    clearCurrent(state) {
      state.current = null;
    },
    setQuizzes(state, action: PayloadAction<Quiz[]>) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load quizzes";
      })
      .addCase(fetchQuizById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchQuizById.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load quiz";
      });
  },
});

export const { clearCurrent, setQuizzes } = quizSlice.actions;
export default quizSlice.reducer;

