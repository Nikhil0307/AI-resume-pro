import React, { useState } from 'react';
import { JobDescription } from '../types';
import { Briefcase, Target, Search } from 'lucide-react';

interface JobDescriptionInputProps {
  onJobSubmit: (jobDescription: JobDescription) => void;
  isGenerating: boolean;
}

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  onJobSubmit,
  isGenerating,
}) => {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobTitle.trim() || !description.trim()) return;

    const jobDescription: JobDescription = {
      title: jobTitle,
      company: company || 'Target Company',
      description,
      requirements: extractRequirements(description),
      keywords: extractKeywords(description),
    };

    onJobSubmit(jobDescription);
  };

  const extractRequirements = (desc: string): string[] => {
    const requirements = [];
    const lines = desc.split('\n');
    
    for (const line of lines) {
      if (line.toLowerCase().includes('require') || line.toLowerCase().includes('must have')) {
        requirements.push(line.trim());
      }
    }
    
    return requirements.slice(0, 5);
  };

  const extractKeywords = (desc: string): string[] => {
    const techKeywords = [
      'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java',
      'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'MySQL',
      'REST', 'GraphQL', 'API', 'Microservices', 'CI/CD', 'Git'
    ];
    
    return techKeywords.filter(keyword => 
      desc.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
        <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
          <Target className="w-5 h-5" />
          <span>Job Description Analysis</span>
        </h2>
        <p className="text-emerald-100 text-sm">Paste the job description to optimize your resume</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title *
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., Senior Software Engineer"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g., Google, Meta, Apple"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Paste the complete job description here..."
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isGenerating || !jobTitle.trim() || !description.trim()}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>{isGenerating ? 'Generating...' : 'Generate Optimized Resumes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};