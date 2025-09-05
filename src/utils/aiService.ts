import { UserProfile, JobDescription, GeneratedResume } from '../types';
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:3001";
export default API_BASE;

export class AIService {
  private static async generateResumeContent(
    profile: UserProfile,
    jobDescription: JobDescription,
    provider: string
  ): Promise<string> {
    console.log(API_BASE)
    const response = await axios.post(`${API_BASE}/generate-resume`, {
      profile,
      jobDescription,
      aiProvider: provider,
    });
    return response.data.resume as string;
  }

  public static async generateResumes(
    profile: UserProfile,
    jobDescription: JobDescription
  ): Promise<GeneratedResume[]> {
    const providers = ['llama', 'mistral', 'deepseek', 'gemini'];

    const results = await Promise.all(
      providers.map(async (provider) => {
        try {
          const content = await this.generateResumeContent(profile, jobDescription, provider);
          return {
            id: `${provider}-${Date.now()}`,
            aiProvider: provider,
            content,
            atsScore: Math.floor(Math.random() * 30) + 70,
            keywordMatch: Math.floor(Math.random() * 40) + 60,
            recommendations: this.generateRecommendations(provider),
            timestamp: new Date(),
            template: 'modern-tech',
          } as GeneratedResume;
        } catch {
          return {
            id: `${provider}-${Date.now()}`,
            aiProvider: provider,
            content: "",
            atsScore: 0,
            keywordMatch: 0,
            recommendations: [`${provider} is currently unavailable.`],
            timestamp: new Date(),
            template: 'modern-tech',
          } as GeneratedResume;
        }
      })
    );

    return results;
  }

  private static generateRecommendations(provider: string): string[] {
    const map: Record<string, string[]> = {
      gemini: [
        'Better keyword density optimization',
        'Improve readability score',
        'Add more relevant technologies',
      ],
      mistral: [
        'Better keyword density optimization',
        'Improve readability score',
        'Add more relevant technologies',
      ],
      llama: [
        'Better keyword density optimization',
        'Improve readability score',
        'Add more relevant technologies',
      ],
      deepseek: [
        'Better keyword density optimization',
        'Improve readability score',
        'Add more relevant technologies',
      ],
    };
    return map[provider.toLowerCase()] || [];
  }
}
