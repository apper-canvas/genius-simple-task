import { configureStore, createSlice } from '@reduxjs/toolkit'
import { format } from 'date-fns'

// Load tasks from localStorage
const loadData = () => {
  try {
    const savedTasks = localStorage.getItem('simpleTasks')
    const savedCategories = localStorage.getItem('simpleCategories')
    
    return {
      tasks: savedTasks ? JSON.parse(savedTasks) : [],
      categories: savedCategories ? JSON.parse(savedCategories) : [
        { id: 'default', name: 'General', color: '#6366f1' },
        { id: 'work', name: 'Work', color: '#f97316' },
        { id: 'personal', name: 'Personal', color: '#22d3ee' }
      ]
    }
  } catch (error) {
    console.error('Error loading data:', error)
    return {
      tasks: [],
      categories: [
        { id: 'default', name: 'General', color: '#6366f1' },
        { id: 'work', name: 'Work', color: '#f97316' },
        { id: 'personal', name: 'Personal', color: '#22d3ee' }
      ]
    }
  }
}

const { tasks: savedTasks, categories: savedCategories } = loadData()

// Task Slice
const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: savedTasks,
    categories: savedCategories,
    filter: 'all',
    categoryFilter: 'all'
  },
  reducers: {
    addTask: (state, action) => {
      const newTask = {
        id: Date.now().toString(),
        title: action.payload.title,
        description: action.payload.description || '',
        categoryId: action.payload.categoryId || 'default',
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
    },
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload
    },
    addCategory: (state, action) => {
      const newCategory = {
        id: action.payload.id || Date.now().toString(),
        name: action.payload.name,
        color: action.payload.color || '#6366f1'
      }
      state.categories.push(newCategory)
      localStorage.setItem('simpleCategories', JSON.stringify(state.categories))
    },
    editCategory: (state, action) => {
      const index = state.categories.findIndex(cat => cat.id === action.payload.id)
      if (index !== -1) {
        state.categories[index] = { ...state.categories[index], ...action.payload }
        localStorage.setItem('simpleCategories', JSON.stringify(state.categories))
      }
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter(cat => cat.id !== action.payload)
      // Update tasks with this category to use default category
      state.tasks = state.tasks.map(task => 
        task.categoryId === action.payload ? { ...task, categoryId: 'default' } : task
      )
      localStorage.setItem('simpleCategories', JSON.stringify(state.categories))
      localStorage.setItem('simpleTasks', JSON.stringify(state.tasks))
    }
  }
})

export const { addTask, toggleTask, deleteTask, setFilter, setCategoryFilter, addCategory, editCategory, deleteCategory } = taskSlice.actions

// Redux store
export const store = configureStore({
  reducer: {
    tasks: taskSlice.reducer
  }
})