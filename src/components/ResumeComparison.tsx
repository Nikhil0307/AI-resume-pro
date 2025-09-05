// src/components/ResumeComparison.tsx
import React, { useState } from 'react';
import { GeneratedResume, JobDescription, UserProfile } from '../types';
import { 
  Bot, 
  Award, 
  TrendingUp,   
  Loader2,
} from 'lucide-react';
import ResumeCard from './ResumeCard';

interface ResumeComparisonProps {
  resumes: GeneratedResume[];
  jobDescription: JobDescription;
  isGenerating: boolean;
  userProfile: UserProfile;
}

export const ResumeComparison: React.FC<ResumeComparisonProps> = ({
  resumes,
  jobDescription,
  isGenerating,
  userProfile,
}) => {
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'comparison' | 'detailed'>('comparison');

  const getProviderColor = (provider: string) => {
    const colors = {
      'mistral': 'bg-green-500',
      'llama': 'bg-orange-500',
      'gemini': 'bg-blue-500',
      'deepseek': 'bg-purple-500',
    };
    return colors[provider as keyof typeof colors] || 'bg-gray-500';
  };

  const getProviderIcon = () => Bot;

  const formatResumeContent = (content: any) => {
    if (typeof content === "string") {
      return content.split("\n").map((line: string, index: number) => {
        if (line.trim() === "") return <br key={index} />;
        if (line.toUpperCase() === line && line.length < 50) {
          return <h3 key={index} className="font-bold text-gray-900 mt-4 mb-2">{line}</h3>;
        }
        return <p key={index} className="text-gray-700 text-sm leading-relaxed mb-2">{line}</p>;
      });
    }

    if (typeof content === "object" && content !== null) {
      return (
        <div className="space-y-4 text-sm text-gray-700">
          {content.summary && (
            <div>
              <h3 className="font-bold text-gray-900">Summary</h3>
              <p>{content.summary}</p>
            </div>
          )}
          {content.skills && (
            <div>
              <h3 className="font-bold text-gray-900">Skills</h3>
              <ul className="list-disc ml-5">
                {Object.entries(content.skills).map(([category, skills]: [string, any], i) => (
                  <li key={i}>
                    <span className="font-medium">{category}: </span>
                    {skills.join(", ")}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {content.work_experience && (
            <div>
              <h3 className="font-bold text-gray-900">Work Experience</h3>
              {content.work_experience.map((exp: any, i: number) => (
                <div key={i} className="mb-2">
                  <p className="font-medium">{exp.title} @ {exp.company}</p>
                  <p className="text-xs text-gray-500">{exp.startDate} - {exp.endDate}</p>
                  <ul className="list-disc ml-5">
                    {exp.achievements.map((ach: string, j: number) => (
                      <li key={j}>{ach}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {content.projects && (
            <div>
              <h3 className="font-bold text-gray-900">Projects</h3>
              {content.projects.map((proj: any, i: number) => (
                <div key={i} className="mb-2">
                  <p className="font-medium">{proj.name}</p>
                  <p>{proj.description}</p>
                  <p className="text-xs text-gray-500">Tech: {proj.technologies.join(", ")}</p>
                </div>
              ))}
            </div>
          )}
          {content.education && (
            <div>
              <h3 className="font-bold text-gray-900">Education</h3>
              {content.education.map((edu: any, i: number) => (
                <p key={i}>{edu.degree}, {edu.institution} ({edu.graduationDate})</p>
              ))}
            </div>
          )}
          {content.certifications && content.certifications.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900">Certifications</h3>
              <ul className="list-disc ml-5">
                {content.certifications.map((cert: string, i: number) => (
                  <li key={i}>{cert}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }

    return <p className="text-gray-500">No resume content available</p>;
  };

  if (isGenerating) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>AI Resume Generation</span>
          </h2>
        </div>

        <div className="p-12 text-center">
          <div className="flex justify-center mb-6">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Generating Optimized Resumes
          </h3>
          <p className="text-gray-600 mb-6">
            Our AI models are analyzing the job description and tailoring your resume...
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['mistral', 'llama', 'gemini', 'deepseek'].map((provider, index) => (
              <div key={provider} className="bg-gray-50 rounded-lg p-4">
                <div className={`w-8 h-8 ${getProviderColor(provider)} rounded-full mx-auto mb-2 flex items-center justify-center`}>
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-700">{provider}</p>
                <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, (index + 1) * 25)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (resumes.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Generation Results</span>
          </h2>
          <p className="text-emerald-100 text-sm">
            Analyzed job at {jobDescription.company} • Generated {resumes.length} versions
          </p>
        </div>
      </div>

      {/* Comparison View */}
      {viewMode === 'comparison' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resumes.map((resume) => {
            const ProviderIcon = getProviderIcon();

            return (
              <ResumeCard
                key={resume.id}
                resume={resume}
                jobDescription={jobDescription}
                userProfile={userProfile}
                selectedResume={selectedResume}
                setSelectedResume={setSelectedResume}
                formatResumeContent={formatResumeContent}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
