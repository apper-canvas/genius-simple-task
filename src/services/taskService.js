// Task-related API operations

export const fetchTasks = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: ["Id", "Name", "title", "description", "completed", "category", "Tags", "CreatedOn"],
      orderBy: [
        {
          field: "CreatedOn",
          direction: "DESC"
        }
      ]
    };

    const response = await apperClient.fetchRecords("task3", params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Only include fields with fieldVisibility: "Updateable"
    const params = {
      records: [
        {
          Name: taskData.title,
          title: taskData.title,
          description: taskData.description || "",
          completed: false,
          category: taskData.category || "General",
          Tags: taskData.tags || []
        }
      ]
    };

    const response = await apperClient.createRecord("task3", params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    } else {
      throw new Error("Failed to create task");
    }
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Only include fields with fieldVisibility: "Updateable"
    const params = {
      records: [
        {
          Id: taskId,
          Name: taskData.title,
          title: taskData.title,
          description: taskData.description,
          completed: taskData.completed,
          category: taskData.category,
          Tags: taskData.tags || []
        }
      ]
    };

    const response = await apperClient.updateRecord("task3", params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    } else {
      throw new Error("Failed to update task");
    }
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const toggleTaskCompletion = async (taskId, currentStatus) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Only include fields with fieldVisibility: "Updateable"
    const params = {
      records: [
        {
          Id: taskId,
          completed: !currentStatus
        }
      ]
    };

    const response = await apperClient.updateRecord("task3", params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    } else {
      throw new Error("Failed to toggle task completion");
    }
  } catch (error) {
    console.error("Error toggling task:", error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [taskId]
    };
    
    const response = await apperClient.deleteRecord("task3", params);
    return response && response.success;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};