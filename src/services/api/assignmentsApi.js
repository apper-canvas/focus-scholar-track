import { toast } from 'react-toastify';

export const assignmentsApi = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "max_points_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "course_id_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('assignment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Map database fields to UI expected format
      return response.data.map(assignment => ({
        Id: assignment.Id,
        title: assignment.title_c || '',
        description: assignment.description_c || '',
        dueDate: assignment.due_date_c || '',
        maxPoints: assignment.max_points_c || 100,
        type: assignment.type_c || '',
        courseId: assignment.course_id_c?.Id || assignment.course_id_c
      }));
    } catch (error) {
      console.error("Error fetching assignments:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "max_points_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "course_id_c"}}
        ]
      };

      const response = await apperClient.getRecordById('assignment_c', id, params);
      
      if (!response?.data) {
        return null;
      }

      const assignment = response.data;
      return {
        Id: assignment.Id,
        title: assignment.title_c || '',
        description: assignment.description_c || '',
        dueDate: assignment.due_date_c || '',
        maxPoints: assignment.max_points_c || 100,
        type: assignment.type_c || '',
        courseId: assignment.course_id_c?.Id || assignment.course_id_c
      };
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(assignmentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: assignmentData.title,
          title_c: assignmentData.title,
          description_c: assignmentData.description || '',
          due_date_c: assignmentData.dueDate,
          max_points_c: assignmentData.maxPoints || 100,
          type_c: assignmentData.type || '',
          course_id_c: parseInt(assignmentData.courseId)
        }]
      };

      const response = await apperClient.createRecord('assignment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} assignments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const createdAssignment = successful[0].data;
          return {
            Id: createdAssignment.Id,
            title: createdAssignment.title_c || '',
            description: createdAssignment.description_c || '',
            dueDate: createdAssignment.due_date_c || '',
            maxPoints: createdAssignment.max_points_c || 100,
            type: createdAssignment.type_c || '',
            courseId: createdAssignment.course_id_c?.Id || createdAssignment.course_id_c
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating assignment:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, assignmentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Id: id,
          Name: assignmentData.title,
          title_c: assignmentData.title,
          description_c: assignmentData.description || '',
          due_date_c: assignmentData.dueDate,
          max_points_c: assignmentData.maxPoints || 100,
          type_c: assignmentData.type || '',
          course_id_c: parseInt(assignmentData.courseId)
        }]
      };

      const response = await apperClient.updateRecord('assignment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} assignments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedAssignment = successful[0].data;
          return {
            Id: updatedAssignment.Id,
            title: updatedAssignment.title_c || '',
            description: updatedAssignment.description_c || '',
            dueDate: updatedAssignment.due_date_c || '',
            maxPoints: updatedAssignment.max_points_c || 100,
            type: updatedAssignment.type_c || '',
            courseId: updatedAssignment.course_id_c?.Id || updatedAssignment.course_id_c
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating assignment:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('assignment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} assignments:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting assignment:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getByCourse(courseId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "max_points_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "course_id_c"}}
        ],
        where: [{"FieldName": "course_id_c", "Operator": "EqualTo", "Values": [parseInt(courseId)]}],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('assignment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(assignment => ({
        Id: assignment.Id,
        title: assignment.title_c || '',
        description: assignment.description_c || '',
        dueDate: assignment.due_date_c || '',
        maxPoints: assignment.max_points_c || 100,
        type: assignment.type_c || '',
        courseId: assignment.course_id_c?.Id || assignment.course_id_c
      }));
    } catch (error) {
      console.error("Error fetching assignments by course:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByType(type) {
    try {
      if (!type) return this.getAll();
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "max_points_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "course_id_c"}}
        ],
        where: [{"FieldName": "type_c", "Operator": "EqualTo", "Values": [type]}],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('assignment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(assignment => ({
        Id: assignment.Id,
        title: assignment.title_c || '',
        description: assignment.description_c || '',
        dueDate: assignment.due_date_c || '',
        maxPoints: assignment.max_points_c || 100,
        type: assignment.type_c || '',
        courseId: assignment.course_id_c?.Id || assignment.course_id_c
      }));
    } catch (error) {
      console.error("Error fetching assignments by type:", error?.response?.data?.message || error);
      return [];
    }
  }
};