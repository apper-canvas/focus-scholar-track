import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Header from '@/components/organisms/Header';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import { Card } from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Label from '@/components/atoms/Label';
import Textarea from '@/components/atoms/Textarea';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import SearchBar from '@/components/molecules/SearchBar';
import FilterSelect from '@/components/molecules/FilterSelect';
import ApperIcon from '@/components/ApperIcon';
import { curriculumActivitiesApi } from '@/services/api/curriculumActivitiesApi';
import { filesApi } from '@/services/api/filesApi';
import { cn } from '@/utils/cn';

const CurriculumActivitiesPage = () => {
  // State management
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [activityToDelete, setActivityToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState([]);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    subject: '',
    gradeLevel: '',
    duration: '',
    startDate: '',
    endDate: '',
    status: 'Planning',
    instructor: '',
    participants: '',
materials: '',
    objectives: '',
    attachedFiles: []
  });

  // Options for dropdowns
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Planning', label: 'Planning' },
    { value: 'Active', label: 'Active' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  const typeOptions = [
    { value: 'Project', label: 'Project' },
    { value: 'Field Trip', label: 'Field Trip' },
    { value: 'Workshop', label: 'Workshop' },
    { value: 'Performance', label: 'Performance' },
    { value: 'Competition Prep', label: 'Competition Prep' },
    { value: 'Service Learning', label: 'Service Learning' },
    { value: 'Research', label: 'Research' },
    { value: 'Simulation', label: 'Simulation' },
    { value: 'Exhibition', label: 'Exhibition' }
  ];

  const subjectOptions = [
    { value: 'all', label: 'All Subjects' },
    { value: 'Science', label: 'Science' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'English Literature', label: 'English Literature' },
    { value: 'History', label: 'History' },
    { value: 'Biology', label: 'Biology' },
    { value: 'Drama', label: 'Drama' },
    { value: 'STEM', label: 'STEM' },
    { value: 'Social Studies', label: 'Social Studies' },
    { value: 'Environmental Science', label: 'Environmental Science' },
    { value: 'Government', label: 'Government' },
    { value: 'Visual Arts', label: 'Visual Arts' },
    { value: 'Earth Science', label: 'Earth Science' }
  ];

  // Load activities on component mount
  useEffect(() => {
    loadActivities();
  }, []);

  // Filter activities when search or filters change
  useEffect(() => {
    filterActivities();
  }, [activities, searchQuery, statusFilter, subjectFilter, typeFilter]);

  const loadActivities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await curriculumActivitiesApi.getAll();
      if (response.success) {
        setActivities(response.data || []);
      } else {
        setError(response.message || 'Failed to load curriculum activities');
        setActivities([]);
      }
    } catch (err) {
      setError('Failed to load curriculum activities');
      setActivities([]);
      console.error('Error loading activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterActivities = () => {
    let filtered = [...activities];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(query) ||
        activity.description.toLowerCase().includes(query) ||
        activity.subject.toLowerCase().includes(query) ||
        activity.instructor.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(activity => activity.status === statusFilter);
    }

    // Apply subject filter
    if (subjectFilter !== 'all') {
      filtered = filtered.filter(activity => activity.subject === subjectFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(activity => activity.type === typeFilter);
    }

    setFilteredActivities(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: '',
      subject: '',
      gradeLevel: '',
      duration: '',
      startDate: '',
      endDate: '',
      status: 'Planning',
      instructor: '',
      participants: '',
materials: '',
      objectives: '',
      attachedFiles: []
    });
    setEditingActivity(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (activity) => {
    setFormData({
      title: activity.title || '',
      description: activity.description || '',
      type: activity.type || '',
      subject: activity.subject || '',
      gradeLevel: activity.gradeLevel || '',
      duration: activity.duration || '',
      startDate: activity.startDate || '',
      endDate: activity.endDate || '',
      status: activity.status || 'Planning',
      instructor: activity.instructor || '',
      participants: activity.participants ? activity.participants.toString() : '',
materials: activity.materials || '',
      objectives: activity.objectives || '',
      attachedFiles: []
    });
    loadActivityFiles(activity.Id);
    setEditingActivity(activity);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.title || !formData.type || !formData.subject) {
      toast.error('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    try {
      const activityData = {
        ...formData,
        participants: formData.participants ? parseInt(formData.participants) : 0
      };

      let response;
      if (editingActivity) {
        response = await curriculumActivitiesApi.update(editingActivity.Id, activityData);
      } else {
        response = await curriculumActivitiesApi.create(activityData);
      }

      if (response.success) {
        toast.success(response.message || `Curriculum activity ${editingActivity ? 'updated' : 'created'} successfully`);
        closeModal();
        loadActivities();
      } else {
        toast.error(response.message || `Failed to ${editingActivity ? 'update' : 'create'} curriculum activity`);
      }
    } catch (error) {
      toast.error(`Failed to ${editingActivity ? 'update' : 'create'} curriculum activity`);
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (activity) => {
    setActivityToDelete(activity);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!activityToDelete) return;

    try {
      const response = await curriculumActivitiesApi.delete(activityToDelete.Id);
      if (response.success) {
        toast.success(response.message || 'Curriculum activity deleted successfully');
        loadActivities();
      } else {
        toast.error(response.message || 'Failed to delete curriculum activity');
      }
    } catch (error) {
      toast.error('Failed to delete curriculum activity');
      console.error('Error deleting activity:', error);
    } finally {
      setIsDeleteModalOpen(false);
      setActivityToDelete(null);
}
  };

  const loadActivityFiles = async (activityId) => {
    try {
      const response = await filesApi.getByEntity('curriculum_activity', activityId);
      if (response.success) {
        setFiles(response.data || []);
        setFormData(prev => ({
          ...prev,
          attachedFiles: response.data || []
        }));
      }
    } catch (error) {
      console.error('Error loading activity files:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length === 0) return;

    setIsUploadingFile(true);
    
    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        // Convert file to base64 for OpenAI analysis (if it's an image)
        let imageData = null;
        if (file.type.startsWith('image/')) {
          imageData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const base64 = e.target.result.split(',')[1];
              resolve(base64);
            };
            reader.readAsDataURL(file);
          });
        }

        const fileData = {
          Name: file.name,
          file_name_c: file.name,
          file_type_c: file.type,
          file_size_c: file.size,
          imageData: imageData
        };

        return await filesApi.uploadWithDescription(
          fileData, 
          'curriculum_activity',
          editingActivity?.Id
        );
      });

      const results = await Promise.all(uploadPromises);
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      if (successful.length > 0) {
        toast.success(`${successful.length} file(s) uploaded successfully`);
        setFiles(prev => [...prev, ...successful.map(r => r.data)]);
        setFormData(prev => ({
          ...prev,
          attachedFiles: [...prev.attachedFiles, ...successful.map(r => r.data)]
        }));
      }

      if (failed.length > 0) {
        toast.error(`${failed.length} file(s) failed to upload`);
      }
    } catch (error) {
      toast.error('File upload failed');
      console.error('Error uploading files:', error);
    } finally {
      setIsUploadingFile(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleRemoveFile = async (fileId) => {
    try {
      const response = await filesApi.delete(fileId);
      if (response.success) {
        toast.success('File removed successfully');
        setFiles(prev => prev.filter(f => f.Id !== fileId));
        setFormData(prev => ({
          ...prev,
          attachedFiles: prev.attachedFiles.filter(f => f.Id !== fileId)
        }));
      } else {
        toast.error('Failed to remove file');
      }
    } catch (error) {
      toast.error('Failed to remove file');
      console.error('Error removing file:', error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Completed':
        return 'primary';
      case 'Planning':
        return 'secondary';
      case 'Cancelled':
        return 'error';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Header />
        <Loading message="Loading curriculum activities..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Header />
        <Error message={error} onRetry={loadActivities} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">Curriculum Activities</h1>
              <p className="text-secondary-600 mt-2">Manage educational activities and programs</p>
            </div>
            <Button onClick={openAddModal} className="flex items-center space-x-2">
              <ApperIcon name="Plus" size={16} />
              <span>Add Activity</span>
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <div className="p-4 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search activities by title, description, subject, or instructor..."
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <FilterSelect
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={statusOptions}
                  placeholder="Filter by status"
                />
                <FilterSelect
                  value={subjectFilter}
                  onChange={setSubjectFilter}
                  options={subjectOptions}
                  placeholder="Filter by subject"
                />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  {typeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Activities Table */}
        {filteredActivities.length === 0 ? (
          <Empty
            title="No curriculum activities found"
            description={searchQuery || statusFilter !== 'all' || subjectFilter !== 'all' || typeFilter !== 'all'
              ? "No activities match your current filters. Try adjusting your search criteria."
              : "Get started by creating your first curriculum activity."
            }
            action={
              <Button onClick={openAddModal} className="flex items-center space-x-2">
                <ApperIcon name="Plus" size={16} />
                <span>Add Activity</span>
              </Button>
            }
          />
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full table-hover">
                <thead className="bg-secondary-50 border-b border-secondary-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Subject & Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Duration & Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Instructor
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Participants
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                  {filteredActivities.map((activity) => (
                    <tr key={activity.Id} className="hover:bg-secondary-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <h3 className="text-sm font-medium text-secondary-900 line-clamp-2">
                            {activity.title}
                          </h3>
                          <p className="text-sm text-secondary-500 line-clamp-2 mt-1">
                            {activity.description}
                          </p>
                          <div className="text-xs text-secondary-400 mt-1">
                            Grade: {activity.gradeLevel}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm font-medium text-secondary-900">
                            {activity.subject}
                          </span>
                          <Badge variant="secondary" size="sm">
                            {activity.type}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-secondary-900">
                        <div className="flex flex-col space-y-1">
                          <span className="font-medium">{activity.duration}</span>
                          <div className="text-xs text-secondary-500">
                            {formatDate(activity.startDate)} - {formatDate(activity.endDate)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getStatusBadgeVariant(activity.status)}>
                          {activity.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-secondary-900">
                        {activity.instructor}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-secondary-900">
                          {activity.participants || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(activity)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <ApperIcon name="Edit2" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(activity)}
                          className="text-error-600 hover:text-error-900"
                        >
                          <ApperIcon name="Trash2" size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-secondary-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-secondary-900">
                  {editingActivity ? 'Edit Activity' : 'Add New Activity'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeModal}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Activity title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select type</option>
                    {typeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the activity..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Subject area"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gradeLevel">Grade Level</Label>
                  <Input
                    id="gradeLevel"
                    name="gradeLevel"
                    value={formData.gradeLevel}
                    onChange={handleInputChange}
                    placeholder="e.g., 9-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 2 weeks"
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Planning">Planning</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input
                    id="instructor"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleInputChange}
                    placeholder="Instructor name"
                  />
                </div>
                <div>
                  <Label htmlFor="participants">Participants</Label>
                  <Input
                    id="participants"
                    name="participants"
                    type="number"
                    min="0"
                    value={formData.participants}
                    onChange={handleInputChange}
                    placeholder="Number of participants"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="materials">Materials</Label>
                <Textarea
                  id="materials"
                  name="materials"
                  value={formData.materials}
                  onChange={handleInputChange}
                  placeholder="Required materials and resources..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="objectives">Objectives</Label>
                <Textarea
                  id="objectives"
                  name="objectives"
                  value={formData.objectives}
                  onChange={handleInputChange}
                  placeholder="Learning objectives and goals..."
                  rows={2}
/>
              </div>

              {/* File Upload Section */}
              <div>
                <Label htmlFor="fileUpload">Attachments</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    id="fileUpload"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploadingFile}
                  />
                  <div className="border-2 border-dashed border-secondary-300 rounded-lg p-4 text-center hover:border-secondary-400 transition-colors">
                    <ApperIcon name="Upload" size={24} className="mx-auto text-secondary-400 mb-2" />
                    <div className="text-sm text-secondary-600 mb-2">
                      <label 
                        htmlFor="fileUpload" 
                        className="font-medium text-primary-600 hover:text-primary-500 cursor-pointer"
                      >
                        {isUploadingFile ? 'Uploading...' : 'Click to upload'}
                      </label>
                      {' '}or drag and drop
                    </div>
                    <p className="text-xs text-secondary-500">
                      Images will be automatically analyzed with AI
                    </p>
                  </div>
                </div>

                {/* File List */}
                {formData.attachedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <h4 className="text-sm font-medium text-secondary-700">Attached Files:</h4>
                    {formData.attachedFiles.map((file) => (
                      <div key={file.Id} className="flex items-center justify-between p-2 bg-secondary-50 rounded border">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <ApperIcon 
                              name={file.file_type_c?.startsWith('image/') ? 'Image' : 'File'} 
                              size={16} 
                              className="text-secondary-500 flex-shrink-0" 
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-secondary-900 truncate">
                                {file.file_name_c}
                              </p>
                              <p className="text-xs text-secondary-500">
                                {formatFileSize(file.file_size_c || 0)}
                              </p>
                              {file.openai_description_c && (
                                <p className="text-xs text-primary-600 italic mt-1">
                                  AI: {file.openai_description_c}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(file.Id)}
                          className="text-error-600 hover:text-error-700 flex-shrink-0 ml-2"
                        >
                          <ApperIcon name="X" size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
<div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                <Button type="button" variant="ghost" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <ApperIcon name="Loader" size={16} className="animate-spin mr-2" />
                      {editingActivity ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingActivity ? 'Update Activity' : 'Create Activity'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && activityToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-error-100 rounded-full flex items-center justify-center">
                  <ApperIcon name="AlertTriangle" size={20} className="text-error-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-secondary-900">Delete Activity</h3>
                  <p className="text-sm text-secondary-600 mt-1">
                    Are you sure you want to delete "{activityToDelete.title}"? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-secondary-50 flex justify-end space-x-3">
              <Button
                variant="ghost"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
              >
                Delete Activity
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurriculumActivitiesPage;