export interface UserProfile {
  id: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
  };
  summary: string;
  experience: WorkExperience[];
  projects: Project[];
  skills: {
    technical: string[];
    soft: string[];
  };
  education: Education[];
  certifications: string[];
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  achievements: string[];
  technologies: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url: string;
  github: string;
  achievements: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa?: string;
  relevant_courses?: string[];
}

export interface JobDescription {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  keywords: string[];
}

export interface GeneratedResume {
  id: string;
  aiProvider: string;
  content: string;
  atsScore: number;
  keywordMatch: number;
  recommendations: string[];
  timestamp: Date;
  template: string;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  style: 'modern' | 'classic' | 'technical' | 'creative';
  atsOptimized: boolean;
}

export interface ATSAnalysis {
  score: number;
  keywordMatch: number;
  missingKeywords: string[];
  recommendations: string[];
  formatCompliance: number;
}