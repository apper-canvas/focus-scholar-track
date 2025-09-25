import mockData from '../mockData/curriculumActivities.json';

// Utility function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for mock data
let curriculumActivities = [...mockData];
let nextId = Math.max(...mockData.map(item => item.Id)) + 1;

export const curriculumActivitiesApi = {
  // Get all curriculum activities
  async getAll() {
    await delay(300);
    try {
      return {
        success: true,
        data: curriculumActivities.map(activity => ({ ...activity })), // Return copies
        total: curriculumActivities.length
      };
    } catch (error) {
      console.error('Error fetching curriculum activities:', error);
      return {
        success: false,
        message: 'Failed to fetch curriculum activities',
        data: [],
        total: 0
      };
    }
  },

  // Get curriculum activity by ID
  async getById(id) {
    await delay(300);
    try {
      const activity = curriculumActivities.find(item => item.Id === parseInt(id));
      if (!activity) {
        return {
          success: false,
          message: 'Curriculum activity not found',
          data: null
        };
      }
      return {
        success: true,
        data: { ...activity }, // Return copy
        message: 'Curriculum activity retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching curriculum activity:', error);
      return {
        success: false,
        message: 'Failed to fetch curriculum activity',
        data: null
      };
    }
  },

  // Create new curriculum activity
  async create(activityData) {
    await delay(300);
    try {
      const newActivity = {
        ...activityData,
        Id: nextId++,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      curriculumActivities.unshift(newActivity);
      
      return {
        success: true,
        data: { ...newActivity }, // Return copy
        message: 'Curriculum activity created successfully'
      };
    } catch (error) {
      console.error('Error creating curriculum activity:', error);
      return {
        success: false,
        message: 'Failed to create curriculum activity',
        data: null
      };
    }
  },

  // Update curriculum activity
  async update(id, activityData) {
    await delay(300);
    try {
      const index = curriculumActivities.findIndex(item => item.Id === parseInt(id));
      if (index === -1) {
        return {
          success: false,
          message: 'Curriculum activity not found',
          data: null
        };
      }

      curriculumActivities[index] = {
        ...curriculumActivities[index],
        ...activityData,
        Id: parseInt(id), // Ensure ID doesn't change
        updatedAt: new Date().toISOString()
      };

      return {
        success: true,
        data: { ...curriculumActivities[index] }, // Return copy
        message: 'Curriculum activity updated successfully'
      };
    } catch (error) {
      console.error('Error updating curriculum activity:', error);
      return {
        success: false,
        message: 'Failed to update curriculum activity',
        data: null
      };
    }
  },

  // Delete curriculum activity
  async delete(id) {
    await delay(300);
    try {
      const index = curriculumActivities.findIndex(item => item.Id === parseInt(id));
      if (index === -1) {
        return {
          success: false,
          message: 'Curriculum activity not found'
        };
      }

      const deletedActivity = curriculumActivities[index];
      curriculumActivities.splice(index, 1);

      return {
        success: true,
        data: { ...deletedActivity }, // Return copy
        message: 'Curriculum activity deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting curriculum activity:', error);
      return {
        success: false,
        message: 'Failed to delete curriculum activity'
      };
    }
  },

  // Search and filter activities
  async search(query = '', filters = {}) {
    await delay(300);
    try {
      let filtered = [...curriculumActivities];

      // Apply text search
      if (query.trim()) {
        const searchTerm = query.toLowerCase();
        filtered = filtered.filter(activity =>
          activity.title.toLowerCase().includes(searchTerm) ||
          activity.description.toLowerCase().includes(searchTerm) ||
          activity.subject.toLowerCase().includes(searchTerm) ||
          activity.instructor.toLowerCase().includes(searchTerm)
        );
      }

      // Apply status filter
      if (filters.status && filters.status !== 'all') {
        filtered = filtered.filter(activity => activity.status === filters.status);
      }

      // Apply subject filter
      if (filters.subject && filters.subject !== 'all') {
        filtered = filtered.filter(activity => activity.subject === filters.subject);
      }

      // Apply type filter
      if (filters.type && filters.type !== 'all') {
        filtered = filtered.filter(activity => activity.type === filters.type);
      }

      return {
        success: true,
        data: filtered.map(activity => ({ ...activity })), // Return copies
        total: filtered.length
      };
    } catch (error) {
      console.error('Error searching curriculum activities:', error);
      return {
        success: false,
        message: 'Failed to search curriculum activities',
        data: [],
        total: 0
      };
    }
  }
};

export default curriculumActivitiesApi;