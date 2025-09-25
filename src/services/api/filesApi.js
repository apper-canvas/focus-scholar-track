// Utility function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const filesApi = {
  // Get all files
  async getAll() {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "file_name_c"}},
          {"field": {"Name": "file_type_c"}},
          {"field": {"Name": "file_size_c"}},
          {"field": {"Name": "upload_date_c"}},
          {"field": {"Name": "openai_description_c"}},
          {"field": {"Name": "entity_type_c"}},
          {"field": {"Name": "entity_id_c"}}
        ],
        orderBy: [{"fieldName": "upload_date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };

      const response = await apperClient.fetchRecords('files_c', params);

      if (!response.success) {
        console.error(response.message);
        return {
          success: false,
          message: response.message,
          data: [],
          total: 0
        };
      }

      return {
        success: true,
        data: response.data || [],
        total: response.total || 0
      };
    } catch (error) {
      console.error('Error fetching files:', error);
      return {
        success: false,
        message: 'Failed to fetch files',
        data: [],
        total: 0
      };
    }
  },

  // Get file by ID
  async getById(id) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "file_name_c"}},
          {"field": {"Name": "file_type_c"}},
          {"field": {"Name": "file_size_c"}},
          {"field": {"Name": "upload_date_c"}},
          {"field": {"Name": "openai_description_c"}},
          {"field": {"Name": "entity_type_c"}},
          {"field": {"Name": "entity_id_c"}}
        ]
      };

      const response = await apperClient.getRecordById('files_c', id, params);

      if (!response?.data) {
        return {
          success: false,
          message: 'File not found',
          data: null
        };
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error(`Error fetching file ${id}:`, error);
      return {
        success: false,
        message: 'Failed to fetch file',
        data: null
      };
    }
  },

  // Upload file with OpenAI description
  async uploadWithDescription(fileData, entityType = null, entityId = null) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      let openaiDescription = '';

      // Generate OpenAI description for image files
      if (fileData.file_type_c && fileData.file_type_c.startsWith('image/')) {
        try {
          const analyzeResponse = await apperClient.functions.invoke(import.meta.env.VITE_ANALYZE_IMAGE_WITH_OPENAI || 'analyze-image-with-openai', {
            body: JSON.stringify({
              imageData: fileData.imageData,
              mimeType: fileData.file_type_c
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (analyzeResponse.success && analyzeResponse.data?.description) {
            openaiDescription = analyzeResponse.data.description;
          }
        } catch (error) {
          console.error('OpenAI analysis failed:', error);
          // Continue without description if AI analysis fails
        }
      }

      // Prepare file record data
      const fileRecord = {
        Name: fileData.Name,
        Tags: fileData.Tags || '',
        file_name_c: fileData.file_name_c,
        file_type_c: fileData.file_type_c,
        file_size_c: fileData.file_size_c,
        upload_date_c: new Date().toISOString(),
        openai_description_c: openaiDescription,
        entity_type_c: entityType || '',
        entity_id_c: entityId || null
      };

      const params = {
        records: [fileRecord]
      };

      const response = await apperClient.createRecord('files_c', params);

      if (!response.success) {
        console.error(response.message);
        return {
          success: false,
          message: response.message,
          data: null
        };
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} files:`, failed);
          return {
            success: false,
            message: failed[0].message || 'Failed to upload file',
            data: null
          };
        }

        return {
          success: true,
          data: successful[0].data,
          message: 'File uploaded successfully'
        };
      }

      return {
        success: false,
        message: 'Unexpected response format',
        data: null
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        success: false,
        message: 'Failed to upload file',
        data: null
      };
    }
  },

  // Update file
  async update(id, fileData) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateRecord = {
        Id: parseInt(id),
        ...fileData
      };

      const params = {
        records: [updateRecord]
      };

      const response = await apperClient.updateRecord('files_c', params);

      if (!response.success) {
        console.error(response.message);
        return {
          success: false,
          message: response.message,
          data: null
        };
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} files:`, failed);
          return {
            success: false,
            message: failed[0].message || 'Failed to update file',
            data: null
          };
        }

        return {
          success: true,
          data: successful[0].data,
          message: 'File updated successfully'
        };
      }

      return {
        success: false,
        message: 'Unexpected response format',
        data: null
      };
    } catch (error) {
      console.error('Error updating file:', error);
      return {
        success: false,
        message: 'Failed to update file',
        data: null
      };
    }
  },

  // Delete file
  async delete(id) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('files_c', params);

      if (!response.success) {
        console.error(response.message);
        return {
          success: false,
          message: response.message
        };
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} files:`, failed);
          return {
            success: false,
            message: failed[0].message || 'Failed to delete file'
          };
        }

        return {
          success: true,
          message: 'File deleted successfully'
        };
      }

      return {
        success: false,
        message: 'Unexpected response format'
      };
    } catch (error) {
      console.error('Error deleting file:', error);
      return {
        success: false,
        message: 'Failed to delete file'
      };
    }
  },

  // Get files by entity
  async getByEntity(entityType, entityId) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "file_name_c"}},
          {"field": {"Name": "file_type_c"}},
          {"field": {"Name": "file_size_c"}},
          {"field": {"Name": "upload_date_c"}},
          {"field": {"Name": "openai_description_c"}},
          {"field": {"Name": "entity_type_c"}},
          {"field": {"Name": "entity_id_c"}}
        ],
        where: [
          {"FieldName": "entity_type_c", "Operator": "EqualTo", "Values": [entityType]},
          {"FieldName": "entity_id_c", "Operator": "EqualTo", "Values": [parseInt(entityId)]}
        ],
        orderBy: [{"fieldName": "upload_date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };

      const response = await apperClient.fetchRecords('files_c', params);

      if (!response.success) {
        console.error(response.message);
        return {
          success: false,
          message: response.message,
          data: [],
          total: 0
        };
      }

      return {
        success: true,
        data: response.data || [],
        total: response.total || 0
      };
    } catch (error) {
      console.error('Error fetching files by entity:', error);
      return {
        success: false,
        message: 'Failed to fetch files',
        data: [],
        total: 0
      };
    }
  }
};

export default filesApi;