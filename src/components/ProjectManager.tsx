import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  FolderOpen, 
  Code, 
  Gamepad2, 
  Settings, 
  Calendar,
  Clock,
  Star,
  Trash2,
  Play,
  Edit,
  Copy,
  Download,
  Upload
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  type: 'game' | 'lesson' | 'experiment';
  description: string;
  createdAt: Date;
  lastModified: Date;
  status: 'active' | 'completed' | 'archived';
  progress: number;
  tags: string[];
  thumbnail?: string;
}

interface ProjectManagerProps {
  onBack: () => void;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({ onBack }) => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'My First Platformer',
      type: 'game',
      description: 'A simple platformer game with jumping and collecting coins',
      createdAt: new Date('2024-01-15'),
      lastModified: new Date('2024-01-20'),
      status: 'active',
      progress: 75,
      tags: ['platformer', 'beginner', 'javascript']
    },
    {
      id: '2',
      name: 'Loop Practice',
      type: 'lesson',
      description: 'Practicing for loops and while loops',
      createdAt: new Date('2024-01-10'),
      lastModified: new Date('2024-01-18'),
      status: 'completed',
      progress: 100,
      tags: ['loops', 'practice', 'cs1']
    },
    {
      id: '3',
      name: 'Snake Game Experiment',
      type: 'experiment',
      description: 'Trying to recreate the classic Snake game',
      createdAt: new Date('2024-01-05'),
      lastModified: new Date('2024-01-12'),
      status: 'archived',
      progress: 45,
      tags: ['snake', 'classic', 'experiment']
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed' | 'archived'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newProject, setNewProject] = useState({
    name: '',
    type: 'game' as Project['type'],
    description: '',
    tags: ''
  });

  const projectTypes = [
    { id: 'game', label: 'Game Project', icon: Gamepad2, color: 'from-green-500 to-teal-600', description: 'Create a complete game' },
    { id: 'lesson', label: 'Lesson Practice', icon: Code, color: 'from-blue-500 to-indigo-600', description: 'Practice coding concepts' },
    { id: 'experiment', label: 'Experiment', icon: Settings, color: 'from-purple-500 to-pink-600', description: 'Try new ideas and concepts' }
  ];

  const statusFilters = [
    { id: 'all', label: 'All Projects', count: projects.length },
    { id: 'active', label: 'Active', count: projects.filter(p => p.status === 'active').length },
    { id: 'completed', label: 'Completed', count: projects.filter(p => p.status === 'completed').length },
    { id: 'archived', label: 'Archived', count: projects.filter(p => p.status === 'archived').length }
  ];

  const handleCreateProject = () => {
    if (!newProject.name.trim()) {
      alert('Please enter a project name');
      return;
    }

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      type: newProject.type,
      description: newProject.description,
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'active',
      progress: 0,
      tags: newProject.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    };

    setProjects(prev => [project, ...prev]);
    setNewProject({ name: '', type: 'game', description: '', tags: '' });
    setShowCreateModal(false);
  };

  const deleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(prev => prev.filter(p => p.id !== projectId));
    }
  };

  const duplicateProject = (project: Project) => {
    const duplicated: Project = {
      ...project,
      id: Date.now().toString(),
      name: `${project.name} (Copy)`,
      createdAt: new Date(),
      lastModified: new Date(),
      progress: 0,
      status: 'active'
    };
    setProjects(prev => [duplicated, ...prev]);
  };

  const filteredProjects = projects.filter(project => {
    const matchesFilter = activeFilter === 'all' || project.status === activeFilter;
    const matchesSearch = searchTerm === '' || 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getProjectTypeIcon = (type: Project['type']) => {
    switch (type) {
      case 'game': return <Gamepad2 className="w-5 h-5" />;
      case 'lesson': return <Code className="w-5 h-5" />;
      case 'experiment': return <Settings className="w-5 h-5" />;
    }
  };

  const getProjectTypeColor = (type: Project['type']) => {
    switch (type) {
      case 'game': return 'from-green-500 to-teal-600';
      case 'lesson': return 'from-blue-500 to-indigo-600';
      case 'experiment': return 'from-purple-500 to-pink-600';
    }
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'completed': return 'text-blue-400';
      case 'archived': return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'active': return '🟢';
      case 'completed': return '✅';
      case 'archived': return '📦';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold">📁 Project Manager</h1>
              <p className="text-blue-100">Organize and manage your coding projects</p>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>New Project</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white bg-opacity-10 rounded-2xl p-6 sticky top-8">
              {/* Search */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
              </div>

              {/* Status Filters */}
              <h2 className="text-xl font-bold text-white mb-4">Status</h2>
              <div className="space-y-2 mb-6">
                {statusFilters.map(({ id, label, count }) => (
                  <button
                    key={id}
                    onClick={() => setActiveFilter(id as unknown as 'all' | 'active' | 'completed' | 'archived')}
                    className={`
                      w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200
                      ${activeFilter === id 
                        ? 'bg-blue-500 bg-opacity-30 border-2 border-blue-400' 
                        : 'bg-white bg-opacity-5 hover:bg-opacity-10 border-2 border-transparent'
                      }
                    `}
                  >
                    <span className="text-white font-medium">{label}</span>
                    <span className="text-gray-300 text-sm">{count}</span>
                  </button>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="space-y-3">
                <h3 className="text-white font-medium">Quick Stats</h3>
                <div className="bg-white bg-opacity-5 rounded-lg p-3">
                  <div className="text-gray-300 text-sm">Total Projects</div>
                  <div className="text-white font-bold text-lg">{projects.length}</div>
                </div>
                <div className="bg-white bg-opacity-5 rounded-lg p-3">
                  <div className="text-gray-300 text-sm">Active Projects</div>
                  <div className="text-white font-bold text-lg">
                    {projects.filter(p => p.status === 'active').length}
                  </div>
                </div>
                <div className="bg-white bg-opacity-5 rounded-lg p-3">
                  <div className="text-gray-300 text-sm">Completed</div>
                  <div className="text-white font-bold text-lg">
                    {projects.filter(p => p.status === 'completed').length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white bg-opacity-10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {activeFilter === 'all' ? 'All Projects' : 
                   statusFilters.find(f => f.id === activeFilter)?.label}
                </h2>
                <div className="text-gray-300">
                  {filteredProjects.length} projects
                </div>
              </div>

              {filteredProjects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📁</div>
                  <h3 className="text-xl font-bold text-white mb-2">No Projects Found</h3>
                  <p className="text-gray-300 mb-6">
                    {searchTerm 
                      ? `No projects match "${searchTerm}"`
                      : activeFilter === 'all' 
                        ? 'Create your first project to get started'
                        : `No ${activeFilter} projects found`
                    }
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Create New Project
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white bg-opacity-5 rounded-xl p-6 hover:bg-opacity-10 transition-all duration-200"
                    >
                      {/* Project Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 bg-gradient-to-r ${getProjectTypeColor(project.type)} rounded-lg`}>
                            {getProjectTypeIcon(project.type)}
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-lg">{project.name}</h3>
                            <div className="flex items-center space-x-2 text-sm">
                              <span className="text-gray-300 capitalize">{project.type}</span>
                              <span className="text-gray-500">•</span>
                              <span className={getStatusColor(project.status)}>
                                {getStatusIcon(project.status)} {project.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => duplicateProject(project)}
                            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={() => deleteProject(project.id)}
                            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>

                      {/* Project Description */}
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {project.description || 'No description provided'}
                      </p>

                      {/* Progress Bar */}
                      {project.progress > 0 && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-300 mb-1">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className={`bg-gradient-to-r ${getProjectTypeColor(project.type)} h-2 rounded-full transition-all duration-300`}
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {project.tags.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {project.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-600 rounded text-white text-xs">
                                {tag}
                              </span>
                            ))}
                            {project.tags.length > 3 && (
                              <span className="text-gray-400 text-xs">+{project.tags.length - 3}</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Project Meta */}
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Created {project.createdAt.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Modified {project.lastModified.toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                          <Play className="w-4 h-4" />
                          <span>Open</span>
                        </button>
                        <button className="flex items-center justify-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Project Tips */}
            <div className="mt-6 bg-blue-500 bg-opacity-10 border border-blue-400 border-opacity-30 rounded-xl p-4">
              <h3 className="text-blue-300 font-medium mb-2">💡 Project Tips</h3>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• Use descriptive names and tags to organize your projects</li>
                <li>• Game projects are for complete games with multiple features</li>
                <li>• Lesson projects are for practicing specific coding concepts</li>
                <li>• Experiment projects are for trying new ideas and techniques</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create New Project</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Project Name */}
              <div>
                <label className="block text-white font-medium mb-2">Project Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter project name..."
                  className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
              </div>

              {/* Project Type */}
              <div>
                <label className="block text-white font-medium mb-3">Project Type</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {projectTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setNewProject(prev => ({ ...prev, type: type.id as Project['type'] }))}
                      className={`
                        p-4 rounded-xl border-2 transition-all duration-200 text-left
                        ${newProject.type === type.id 
                          ? 'border-blue-400 bg-blue-500 bg-opacity-20' 
                          : 'border-white border-opacity-20 bg-white bg-opacity-5 hover:bg-opacity-10'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`p-2 bg-gradient-to-r ${type.color} rounded-lg`}>
                          <type.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-white font-medium">{type.label}</div>
                      </div>
                      <div className="text-gray-300 text-sm">{type.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-white font-medium mb-2">Description (Optional)</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your project..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-white font-medium mb-2">Tags (Optional)</label>
                <input
                  type="text"
                  value={newProject.tags}
                  onChange={(e) => setNewProject(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="Enter tags separated by commas..."
                  className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                />
                <div className="text-gray-400 text-sm mt-1">
                  Example: platformer, beginner, javascript
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProject}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};