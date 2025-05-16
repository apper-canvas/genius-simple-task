import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { addTask, toggleTask, deleteTask, setFilter } from '../utils/store';
import { getIcon } from '../utils/iconUtils';

const MainFeature = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { tasks, filter } = useSelector(state => state.tasks);
  
  // Get icons
  const PlusIcon = getIcon('Plus');
  const XIcon = getIcon('X');
  const CheckIcon = getIcon('Check');
  const TrashIcon = getIcon('Trash2');
  const ClockIcon = getIcon('Clock');
  const AlertIcon = getIcon('AlertCircle');
  
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Task title cannot be empty!');
      return;
    }
    
    dispatch(addTask({ title: title.trim(), description: description.trim() }));
    toast.success('Task added!');
    
    // Reset form
    setTitle('');
    setDescription('');
    setIsExpanded(false);
  };
  
  const handleToggleTask = (id) => {
    dispatch(toggleTask(id));
    const task = tasks.find(t => t.id === id);
    toast.info(`Task marked as ${!task.completed ? 'complete' : 'incomplete'}`);
  };
  
  const handleDeleteTask = (id) => {
    dispatch(deleteTask(id));
    toast.success('Task deleted');
    if (selectedTaskId === id) {
      setSelectedTaskId(null);
    }
  };
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });
  
  const getTaskCounts = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;
    return { total, completed, active };
  };
  
  const { total, completed, active } = getTaskCounts();
  
  const selectedTask = selectedTaskId 
    ? tasks.find(task => task.id === selectedTaskId) 
    : null;
  
  return (
    <div className="card">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold">My Tasks</h2>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            {total} tasks ({completed} completed, {active} active)
          </p>
        </div>
        
        <div className="flex gap-2 self-start md:self-auto">
          <button 
            onClick={() => dispatch(setFilter('all'))} 
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => dispatch(setFilter('active'))} 
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'active' 
                ? 'bg-primary text-white' 
                : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600'
            }`}
          >
            Active
          </button>
          <button 
            onClick={() => dispatch(setFilter('completed'))} 
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'completed' 
                ? 'bg-primary text-white' 
                : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600'
            }`}
          >
            Completed
          </button>
        </div>
      </div>
      
      {/* Add Task Form */}
      <div className="mb-8">
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.form 
              key="expanded-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="neu-light dark:neu-dark rounded-xl p-4 md:p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add New Task</h3>
                <button 
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                >
                  <XIcon size={18} />
                </button>
              </div>
              
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Task Title*
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="input"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add details about this task..."
                  rows="3"
                  className="input resize-none"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="btn bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                >
                  Add Task
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.button
              key="add-button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsExpanded(true)}
              className="w-full py-3 px-4 border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-xl 
                        hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors text-surface-500 dark:text-surface-400
                        flex items-center justify-center gap-2"
            >
              <PlusIcon size={18} />
              <span>Add New Task</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      {/* Task List */}
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 overflow-auto md:max-h-[600px] scrollbar-hide">
            <h3 className="text-lg font-medium mb-4">Task List</h3>
            
            {filteredTasks.length === 0 ? (
              <div className="bg-surface-100 dark:bg-surface-800 rounded-lg p-4 text-center">
                <p className="text-surface-500 dark:text-surface-400">No tasks found</p>
              </div>
            ) : (
              <ul className="space-y-2">
                <AnimatePresence>
                  {filteredTasks.map(task => (
                    <motion.li 
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`${
                        selectedTaskId === task.id 
                          ? 'bg-primary-light/10 dark:bg-primary-dark/20 border-l-4 border-primary' 
                          : 'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700'
                      } rounded-lg p-3 transition-colors`}
                    >
                      <div className="flex items-start gap-3">
                        <button 
                          onClick={() => handleToggleTask(task.id)}
                          className={`flex-shrink-0 mt-1 h-5 w-5 rounded-full border ${
                            task.completed 
                              ? 'bg-primary border-primary' 
                              : 'border-surface-400 dark:border-surface-600'
                          }`}
                        >
                          {task.completed && (
                            <CheckIcon size={20} className="text-white" />
                          )}
                        </button>
                        
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => setSelectedTaskId(
                            selectedTaskId === task.id ? null : task.id
                          )}
                        >
                          <h4 className={`font-medium ${
                            task.completed ? 'line-through text-surface-400 dark:text-surface-500' : ''
                          }`}>
                            {task.title}
                          </h4>
                          
                          {task.description && (
                            <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 line-clamp-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                        
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="flex-shrink-0 p-1 text-surface-400 hover:text-accent transition-colors"
                          aria-label="Delete task"
                        >
                          <TrashIcon size={16} />
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
          
          <div className="md:col-span-2">
            <AnimatePresence mode="wait">
              {selectedTask ? (
                <motion.div
                  key="task-details"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-surface-800 rounded-xl shadow-soft p-5 min-h-[300px]"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{selectedTask.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleTask(selectedTask.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selectedTask.completed
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                        }`}
                      >
                        {selectedTask.completed ? 'Completed' : 'Active'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center text-sm text-surface-500 dark:text-surface-400 mb-4">
                      <ClockIcon size={14} className="mr-1" />
                      <span>Created: {format(new Date(selectedTask.createdAt), 'PP')}</span>
                    </div>
                    
                    <div className="bg-surface-50 dark:bg-surface-900 rounded-lg p-4 min-h-[100px]">
                      {selectedTask.description ? (
                        <p className="whitespace-pre-wrap">{selectedTask.description}</p>
                      ) : (
                        <p className="text-surface-400 dark:text-surface-500 italic">No description provided</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      onClick={() => setSelectedTaskId(null)}
                      className="btn bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600"
                    >
                      Close
                    </button>
                    
                    <button
                      onClick={() => handleDeleteTask(selectedTask.id)}
                      className="btn bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                    >
                      <TrashIcon size={16} className="mr-1" />
                      Delete Task
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="no-task-selected"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-surface-100 dark:bg-surface-800 rounded-xl p-8 text-center min-h-[300px] flex flex-col items-center justify-center"
                >
                  <AlertIcon size={48} className="text-surface-400 dark:text-surface-500 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Task Selected</h3>
                  <p className="text-surface-500 dark:text-surface-400 max-w-xs mx-auto">
                    Select a task from the list to view details and take actions
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFeature;