import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, MapPin, Globe, Linkedin, Github, Plus, X } from 'lucide-react';

interface ProfileManagerProps {
  profile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({
  profile,
  onProfileUpdate,
}) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [editingProfile, setEditingProfile] = useState(profile);

  const handleSave = () => {
    onProfileUpdate(editingProfile);
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      achievements: [''],
      technologies: [],
    };
    setEditingProfile({
      ...editingProfile,
      experience: [...editingProfile.experience, newExp],
    });
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const updated = [...editingProfile.experience];
    updated[index] = { ...updated[index], [field]: value };
    setEditingProfile({ ...editingProfile, experience: updated });
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'experience', label: 'Experience', icon: MapPin },
    { id: 'skills', label: 'Skills', icon: Globe },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">Profile Management</h2>
        <p className="text-blue-100 text-sm">Complete your profile for optimal resume generation</p>
      </div>

      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-6 max-h-96 overflow-y-auto">
        {activeTab === 'personal' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editingProfile.personalInfo.name}
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      personalInfo: { ...editingProfile.personalInfo, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editingProfile.personalInfo.email}
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      personalInfo: { ...editingProfile.personalInfo, email: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={editingProfile.personalInfo.phone}
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      personalInfo: { ...editingProfile.personalInfo, phone: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={editingProfile.personalInfo.location}
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      personalInfo: { ...editingProfile.personalInfo, location: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
              <textarea
                rows={3}
                value={editingProfile.summary}
                onChange={(e) => setEditingProfile({ ...editingProfile, summary: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="space-y-4">
            {editingProfile.experience.map((exp, index) => (
              <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={exp.title}
                    onChange={(e) => updateExperience(index, 'title', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  {exp.achievements.map((achievement, achIndex) => (
                    <input
                      key={achIndex}
                      type="text"
                      placeholder="Achievement or responsibility"
                      value={achievement}
                      onChange={(e) => {
                        const newAchievements = [...exp.achievements];
                        newAchievements[achIndex] = e.target.value;
                        updateExperience(index, 'achievements', newAchievements);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={addExperience}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Add Experience</span>
            </button>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {editingProfile.skills.technical.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-1"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => {
                        const updated = editingProfile.skills.technical.filter((_, i) => i !== index);
                        setEditingProfile({
                          ...editingProfile,
                          skills: { ...editingProfile.skills, technical: updated },
                        });
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add technical skill"
                onKeyPress={(e) => {
                  const target = e.target as HTMLInputElement;
                  if (e.key === 'Enter' && target.value.trim()) {
                    setEditingProfile({
                      ...editingProfile,
                      skills: {
                        ...editingProfile.skills,
                        technical: [...editingProfile.skills.technical, target.value.trim()],
                      },
                    });
                    target.value = '';
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 px-6 py-4 flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
};
