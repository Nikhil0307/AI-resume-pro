// utils/atsScoring.ts
import { GeneratedResume, JobDescription } from '../types';

type ATSResult = {
  score: number;
  keywordMatch: number;
  missingKeywords: string[];
  recommendations: string[];
  formatCompliance: number;
  details?: any;
};

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:3001";
export default API_BASE;

type GenerateOpts = {
  force?: boolean;   // bypass client-side cache and force network call
  nonce?: number;    // unique value to alter cache key (cache-busting)
};

export class ATSScoring {
  private static cache = new Map<string, ATSResult>();

  private static getCacheKey(resume: GeneratedResume, job: JobDescription, nonce?: number) {
    // include nonce if provided so callers can bust cache without force flag
    const len = typeof resume.content === 'string' ? resume.content.length : JSON.stringify(resume.content).length;
    return `${resume.id}::${job.title ?? ''}::${len}${nonce ? `::${nonce}` : ''}`;
  }

  /**
   * generateATS - call backend / fallback local analyzer
   * opts:
   *   - force: bypass client-side cache and always call API
   *   - nonce: include a unique number in cache key to bust cache
   */
  public static async generateATS(resume: GeneratedResume, job: JobDescription, opts?: GenerateOpts): Promise<ATSResult> {
    const force = !!opts?.force;
    const nonce = opts?.nonce;
    const key = this.getCacheKey(resume, job, nonce);

    // if not forcing and cache has it, return cached
    if (!force && this.cache.has(key)) {
      // console.debug(`[ATSScoring] cache hit for ${key}`);
      return this.cache.get(key)!;
    }

    try {
      const payload = {
        resume: {
          id: resume.id ?? undefined,
          content: resume.content,
        },
        jobDescription: {
          title: job.title ?? "",
          company: job.company ?? "",
          description: job.description ?? "",
          requirements: Array.isArray(job.requirements) ? job.requirements : (job.requirements ? [job.requirements] : []),
          keywords: Array.isArray(job.keywords) ? job.keywords : (job.keywords ? [job.keywords] : []),
        },
        // expose client-side intent to force a fresh evaluation (server can opt-in)
        force: force,
        nonce: nonce ?? undefined,
        modelOverride: undefined,
      };

      const resp = await fetch(`${API_BASE}/generate-ats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        throw new Error(`status ${resp.status}`);
      }

      const json = await resp.json();

      const result: ATSResult = {
        score: typeof json.score === 'number' ? json.score : 0,
        keywordMatch: typeof json.keywordMatch === 'number' ? json.keywordMatch : 0,
        missingKeywords: Array.isArray(json.missingKeywords) ? json.missingKeywords : [],
        recommendations: Array.isArray(json.recommendations) ? json.recommendations : [],
        formatCompliance: typeof json.formatCompliance === 'number' ? json.formatCompliance : 0,
        details: json.details ?? json,
      };

      // store in cache only when not forcing (so force checks don't overwrite cache)
      if (!force) {
        this.cache.set(key, result);
      }

      return result;
    } catch (e) {
      // On error, fall back to local analysis and (if not forcing) cache fallback for speed.
      const fallback = this.localAnalyze(resume, job);
      if (!force) {
        this.cache.set(key, fallback);
      }
      return fallback;
    }
  }

  public static async getCachedIfExists(resume: GeneratedResume, job: JobDescription): Promise<ATSResult | null> {
    const key = this.getCacheKey(resume, job);
    return this.cache.get(key) ?? null;
  }

  private static extractKeywords(description: string): string[] {
    const techKeywords = [
      'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python',
      'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB',
      'API', 'REST', 'GraphQL', 'Git', 'CI/CD', 'Agile', 'Scrum'
    ];
    const descriptionLower = (description || '').toLowerCase();
    return techKeywords.filter(keyword => descriptionLower.includes(keyword.toLowerCase()));
  }

  private static localAnalyze(resume: GeneratedResume, job: JobDescription): ATSResult {
    const keywords = this.extractKeywords(job.description || job.title || '');
    const resumeText = (resume.content || '').toLowerCase();
    const matchedKeywords = keywords.filter(k => resumeText.includes(k.toLowerCase()));
    const keywordMatch = keywords.length ? Math.round((matchedKeywords.length / keywords.length) * 100) : 0;
    const missingKeywords = keywords.filter(k => !resumeText.includes(k.toLowerCase()));

    const baseScore = (resume as any).atsScore ?? 50;
    const computedScore = Math.min(100, Math.round((baseScore * 0.6) + (keywordMatch * 0.4)));

    return {
      score: computedScore,
      keywordMatch,
      missingKeywords: missingKeywords.slice(0, 10),
      recommendations: [
        ...((resume as any).recommendations ?? []),
        ...(keywordMatch < 80 ? ['Add role-specific keywords and technologies found in the job description'] : []),
        ...(computedScore < 80 ? ['Adjust formatting to increase ATS readability (headings, simple fonts)'] : []),
      ],
      formatCompliance: Math.floor(Math.random() * 20) + 80,
      details: { source: 'local-fallback', matchedKeywords, baseScore },
    };
  }

  public static getBestResume(resumes: GeneratedResume[]): GeneratedResume {
    return resumes.reduce((best, current) => {
      const bestScore = ((best as any).atsScore || 0) + ((best as any).keywordMatch || 0);
      const currentScore = ((current as any).atsScore || 0) + ((current as any).keywordMatch || 0);
      return currentScore > bestScore ? current : best;
    });
  }
}
