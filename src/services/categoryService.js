// Category-related API operations

export const fetchCategories = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: ["Id", "Name", "color", "Tags", "CreatedOn"],
      orderBy: [
        {
          field: "Name",
          direction: "ASC"
        }
      ]
    };

    const response = await apperClient.fetchRecords("category1", params);
    
    if (!response || !response.data) {
      // Return default categories if none exist
      return [
        { Id: 'default', Name: 'General', color: '#6366f1' },
        { Id: 'work', Name: 'Work', color: '#f97316' },
        { Id: 'personal', Name: 'Personal', color: '#22d3ee' }
      ];
    }
    
    // If we have categories from the database but not the default ones, add them
    const defaultCategories = [
      { Id: 'default', Name: 'General', color: '#6366f1' },
      { Id: 'work', Name: 'Work', color: '#f97316' },
      { Id: 'personal', Name: 'Personal', color: '#22d3ee' }
    ];
    
    const existingCategoryIds = response.data.map(cat => cat.Id);
    const missingDefaults = defaultCategories.filter(cat => !existingCategoryIds.includes(cat.Id));
    
    if (missingDefaults.length > 0) {
      return [...response.data, ...missingDefaults];
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Return default categories in case of error
    return [
      { Id: 'default', Name: 'General', color: '#6366f1' },
      { Id: 'work', Name: 'Work', color: '#f97316' },
      { Id: 'personal', Name: 'Personal', color: '#22d3ee' }
    ];
  }
};

export const createCategory = async (categoryData) => {
  try {
    // Don't create predefined categories
    if (['default', 'work', 'personal'].includes(categoryData.id)) {
      return { Id: categoryData.id, Name: categoryData.name, color: categoryData.color };
    }
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Only include fields with fieldVisibility: "Updateable"
    const params = {
      records: [
        {
          Name: categoryData.name,
          color: categoryData.color,
          Tags: categoryData.tags || []
        }
      ]
    };

    const response = await apperClient.createRecord("category1", params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    } else {
      throw new Error("Failed to create category");
    }
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    // Don't delete predefined categories
    if (['default', 'work', 'personal'].includes(categoryId)) {
      return true;
    }
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [categoryId]
    };
    
    const response = await apperClient.deleteRecord("category1", params);
    
    // Return true for successful deletion
    return response && response.success;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};