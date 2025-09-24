import React, { useState } from "react";
import Header from "@/components/organisms/Header";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    schoolName: "Lincoln High School",
    academicYear: "2023-2024",
    defaultGradingScale: "standard",
    emailNotifications: true,
    autoBackup: true,
    themeMode: "light"
  });

  const [gradeSettings, setGradeSettings] = useState({
    aMin: 90,
    bMin: 80,
    cMin: 70,
    dMin: 60
  });

  const handleSettingsChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleGradeSettingsChange = (field, value) => {
    setGradeSettings(prev => ({ ...prev, [field]: parseInt(value) || 0 }));
  };

  const handleSaveSettings = () => {
    // In a real application, this would save to a backend
    toast.success("Settings saved successfully");
  };

  const handleResetSettings = () => {
    if (window.confirm("Are you sure you want to reset all settings to defaults?")) {
      setSettings({
        schoolName: "Lincoln High School",
        academicYear: "2023-2024",
        defaultGradingScale: "standard",
        emailNotifications: true,
        autoBackup: true,
        themeMode: "light"
      });
      setGradeSettings({
        aMin: 90,
        bMin: 80,
        cMin: 70,
        dMin: 60
      });
      toast.success("Settings reset to defaults");
    }
  };

  const handleBackupData = () => {
    toast.info("Backup initiated - this may take a few minutes");
    // Simulate backup process
    setTimeout(() => {
      toast.success("Data backup completed successfully");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Settings</h1>
            <p className="text-secondary-600">Manage your Scholar Track preferences and configuration</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* School Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="School" size={20} className="text-primary-600" />
                <span>School Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="School Name" required>
                  <FormField.Input
                    value={settings.schoolName}
                    onChange={(e) => handleSettingsChange("schoolName", e.target.value)}
                    placeholder="Enter school name"
                  />
                </FormField>
                
                <FormField label="Academic Year" required>
                  <FormField.Select
                    value={settings.academicYear}
                    onChange={(e) => handleSettingsChange("academicYear", e.target.value)}
                  >
                    <option value="2023-2024">2023-2024</option>
                    <option value="2024-2025">2024-2025</option>
                    <option value="2025-2026">2025-2026</option>
                  </FormField.Select>
                </FormField>
              </div>
            </CardContent>
          </Card>

          {/* Grading Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Calculator" size={20} className="text-primary-600" />
                <span>Grading Scale</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <FormField label="A Grade Minimum">
                  <FormField.Input
                    type="number"
                    min="0"
                    max="100"
                    value={gradeSettings.aMin}
                    onChange={(e) => handleGradeSettingsChange("aMin", e.target.value)}
                  />
                </FormField>
                
                <FormField label="B Grade Minimum">
                  <FormField.Input
                    type="number"
                    min="0"
                    max="100"
                    value={gradeSettings.bMin}
                    onChange={(e) => handleGradeSettingsChange("bMin", e.target.value)}
                  />
                </FormField>
                
                <FormField label="C Grade Minimum">
                  <FormField.Input
                    type="number"
                    min="0"
                    max="100"
                    value={gradeSettings.cMin}
                    onChange={(e) => handleGradeSettingsChange("cMin", e.target.value)}
                  />
                </FormField>
                
                <FormField label="D Grade Minimum">
                  <FormField.Input
                    type="number"
                    min="0"
                    max="100"
                    value={gradeSettings.dMin}
                    onChange={(e) => handleGradeSettingsChange("dMin", e.target.value)}
                  />
                </FormField>
              </div>
              
              <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
                <h4 className="font-medium text-secondary-900 mb-2">Grade Scale Preview</h4>
                <div className="text-sm text-secondary-600 space-y-1">
                  <div>A: {gradeSettings.aMin}% - 100%</div>
                  <div>B: {gradeSettings.bMin}% - {gradeSettings.aMin - 1}%</div>
                  <div>C: {gradeSettings.cMin}% - {gradeSettings.bMin - 1}%</div>
                  <div>D: {gradeSettings.dMin}% - {gradeSettings.cMin - 1}%</div>
                  <div>F: 0% - {gradeSettings.dMin - 1}%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Settings" size={20} className="text-primary-600" />
                <span>Application Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <FormField label="Default Grading Scale">
                  <FormField.Select
                    value={settings.defaultGradingScale}
                    onChange={(e) => handleSettingsChange("defaultGradingScale", e.target.value)}
                  >
                    <option value="standard">Standard (A-F)</option>
                    <option value="percentage">Percentage Only</option>
                    <option value="points">Points Based</option>
                  </FormField.Select>
                </FormField>

                <FormField label="Theme Mode">
                  <FormField.Select
                    value={settings.themeMode}
                    onChange={(e) => handleSettingsChange("themeMode", e.target.value)}
                  >
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                    <option value="auto">Auto (System)</option>
                  </FormField.Select>
                </FormField>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-secondary-700">Email Notifications</label>
                      <p className="text-sm text-secondary-500">Receive notifications about grades and updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingsChange("emailNotifications", e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-secondary-700">Automatic Backup</label>
                      <p className="text-sm text-secondary-500">Automatically backup data weekly</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.autoBackup}
                        onChange={(e) => handleSettingsChange("autoBackup", e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Database" size={20} className="text-primary-600" />
                <span>Data Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-secondary-900">Backup Data</h4>
                    <p className="text-sm text-secondary-600">Create a backup of all student and grade data</p>
                  </div>
                  <Button onClick={handleBackupData} variant="secondary">
                    <ApperIcon name="Download" size={16} className="mr-2" />
                    Backup Now
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-warning-200 rounded-lg bg-warning-50">
                  <div>
                    <h4 className="font-medium text-warning-900">Reset Settings</h4>
                    <p className="text-sm text-warning-700">Reset all settings to their default values</p>
                  </div>
                  <Button onClick={handleResetSettings} variant="warning">
                    <ApperIcon name="RotateCcw" size={16} className="mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-secondary-200">
            <Button variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>
              <ApperIcon name="Save" size={16} className="mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;