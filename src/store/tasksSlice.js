import { createSlice } from '@reduxjs/toolkit';

// Task Slice
const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    categories: [],
    filter: 'all',
    categoryFilter: 'all',
    isLoading: false,
    error: null
  },
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    addTaskSuccess: (state, action) => {
      state.tasks.push(action.payload);
    },
    updateTaskSuccess: (state, action) => {
      const index = state.tasks.findIndex(task => task.Id === action.payload.Id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    toggleTaskSuccess: (state, action) => {
      const task = state.tasks.find(task => task.Id === action.payload.Id);
      if (task) {
        task.completed = action.payload.completed;
      }
    },
    deleteTaskSuccess: (state, action) => {
      state.tasks = state.tasks.filter(task => task.Id !== action.payload);
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    addCategorySuccess: (state, action) => {
      state.categories.push(action.payload);
    },
    updateCategorySuccess: (state, action) => {
      const index = state.categories.findIndex(cat => cat.Id === action.payload.Id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    deleteCategorySuccess: (state, action) => {
      state.categories = state.categories.filter(cat => cat.Id !== action.payload);
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const {
  setTasks,
  addTaskSuccess,
  updateTaskSuccess,
  toggleTaskSuccess,
  deleteTaskSuccess,
  setCategories,
  addCategorySuccess,
  updateCategorySuccess,
  deleteCategorySuccess,
  setFilter,
  setCategoryFilter,
  setLoading,
  setError
} = tasksSlice.actions;

export default tasksSlice.reducer;