import { configureStore, createSlice } from '@reduxjs/toolkit'
import { format } from 'date-fns'

// Load tasks from localStorage
const loadTasks = () => {
  try {
    const savedTasks = localStorage.getItem('simpleTasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  } catch (error) {
    console.error('Error loading tasks:', error)
    return []
  }
}

// Task Slice
const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: loadTasks(),
    filter: 'all'
  },
  reducers: {
    addTask: (state, action) => {
      const newTask = {
        id: Date.now().toString(),
        title: action.payload.title,
        description: action.payload.description || '',
        completed: false,
        createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
      }
      state.tasks.push(newTask)
      // Save to localStorage
      localStorage.setItem('simpleTasks', JSON.stringify(state.tasks))
    },
    toggleTask: (state, action) => {
      const task = state.tasks.find(task => task.id === action.payload)
      if (task) {
        task.completed = !task.completed
        // Save to localStorage
        localStorage.setItem('simpleTasks', JSON.stringify(state.tasks))
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload)
      // Save to localStorage
      localStorage.setItem('simpleTasks', JSON.stringify(state.tasks))
    },
    setFilter: (state, action) => {
      state.filter = action.payload
    }
  }
})

export const { addTask, toggleTask, deleteTask, setFilter } = taskSlice.actions

// Redux store
export const store = configureStore({
  reducer: {
    tasks: taskSlice.reducer
  }
})