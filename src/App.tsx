import React, { useState } from 'react';
import { UserProfile, JobDescription, GeneratedResume } from './types';
import { ProfileManager } from './components/ProfileManager';
import { JobDescriptionInput } from './components/JobDescriptionInput';
import { TemplateSelector } from './components/TemplateSelector';
import { ResumeComparison } from './components/ResumeComparison';
import { AIService } from './utils/aiService';
import { sampleProfile } from './data/templates';
import { Brain, FileText, Target, Award, Download, Sparkles } from 'lucide-react';

type AppStep = 'profile' | 'template' | 'job' | 'results';

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('profile');
  const [userProfile, setUserProfile] = useState<UserProfile>(sampleProfile);
  const [selectedTemplate, setSelectedTemplate] = useState('modern-tech');
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(null);
  const [generatedResumes, setGeneratedResumes] = useState<GeneratedResume[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleJobSubmit = async (job: JobDescription) => {
    setJobDescription(job);
    setIsGenerating(true);
    setCurrentStep('results');

    try {
      const resumes = await AIService.generateResumes(userProfile, job);
      setGeneratedResumes(resumes);
    } catch (error) {
      console.error('Error generating resumes:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const steps = [
    { id: 'profile', label: 'Profile', icon: Brain, completed: true },
    { id: 'template', label: 'Template', icon: FileText, completed: currentStep !== 'profile' },
    { id: 'job', label: 'Job Analysis', icon: Target, completed: jobDescription !== null },
    { id: 'results', label: 'Results', icon: Award, completed: generatedResumes.length > 0 },
  ];

  const getStepContent = () => {
    switch (currentStep) {
      case 'profile':
        return (
          <div className="space-y-6">
            <ProfileManager
              profile={userProfile}
              onProfileUpdate={setUserProfile}
            />
            <div className="flex justify-end">
              <button
                onClick={() => setCurrentStep('template')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Continue to Templates
              </button>
            </div>
          </div>
        );
      
      case 'template':
        return (
          <div className="space-y-6">
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateSelect={setSelectedTemplate}
            />
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep('profile')}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Back to Profile
              </button>
              <button
                onClick={() => setCurrentStep('job')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Continue to Job Analysis
              </button>
            </div>
          </div>
        );
      
      case 'job':
        return (
          <div className="space-y-6">
            <JobDescriptionInput
              onJobSubmit={handleJobSubmit}
              isGenerating={isGenerating}
            />
            <div className="flex justify-start">
              <button
                onClick={() => setCurrentStep('template')}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Back to Templates
              </button>
            </div>
          </div>
        );
      
      case 'results':
        return (
          <div className="space-y-6">
            <ResumeComparison
              resumes={generatedResumes}
              jobDescription={jobDescription!}
              isGenerating={isGenerating}
              userProfile={userProfile}
            />
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep('job')}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                New Job Analysis
              </button>
              {generatedResumes.length > 0 && (
                <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download Selected Resume</span>
                </button>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Resume Pro</h1>
                <p className="text-xs text-gray-500">AI-Powered Resume Optimization</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.completed;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                        {step.label}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-px mx-8 ${isCompleted ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentStep === 'profile' && 'Build Your Professional Profile'}
            {currentStep === 'template' && 'Choose Your Resume Template'}
            {currentStep === 'job' && 'Analyze Target Job Description'}
            {currentStep === 'results' && 'AI-Generated Resume Comparison'}
          </h2>
          <p className="text-gray-600">
            {currentStep === 'profile' && 'Create a comprehensive profile that will be optimized for every job application'}
            {currentStep === 'template' && 'Select a professional template that matches your industry and style preferences'}
            {currentStep === 'job' && 'Paste the job description to generate perfectly tailored resumes from multiple AI providers'}
            {currentStep === 'results' && 'Compare AI-generated resumes with ATS scores to select the best version'}
          </p>
        </div>

        {getStepContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 space-y-4">

            {/* Main Info */}
            <p className="text-sm">
              © 2025 ResumeForge. Optimize your career with AI-powered resume generation.
            </p>

            {/* Disclaimer */}
            <p className="text-xs text-gray-500 max-w-2xl mx-auto">
              ⚠️ Note: This project runs on free resources — some AI models may not perform well, 
              and calls might occasionally fail.
            </p>

            {/* Custom Links */}
            <div>
              <p className="text-sm">Made with ♥️ by Nikhil</p>
              <div className="flex items-center justify-center gap-2 mt-2 text-sm">
                <a
                  href="https://ko-fi.com/K3K81FOHEA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Buy Me a ☕️
                </a>
                <span>•</span>
                <a
                  href="https://www.linkedin.com/in/nikhil0307/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  LinkedIn
                </a>
                <span>•</span>
                <a
                  href="https://nikhil-baskar.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Portfolio
                </a>
              </div>
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
