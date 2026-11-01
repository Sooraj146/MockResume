export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  github?: string;
  website?: string;
  title: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface WorkExperience {
  company: string;
  role: string;
  period: string;
  highlights: string[];
  technologies: string[];
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
  details?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  metrics?: string;
}

export interface ParsedResume {
  rawText: string;
  contact: ContactInfo;
  summary: string;
  skillCategories: SkillCategory[];
  allSkills: string[];
  experiences: WorkExperience[];
  education: Education[];
  projects: Project[];
  pageCount: number;
  wordCount: number;
}

export interface ATSMetrics {
  overallScore: number;
  atsCompatibility: number; // 0-100
  formattingScore: number; // 0-100
  skillDensityScore: number; // 0-100
  impactMetricScore: number; // 0-100
  readabilityScore: number; // 0-100
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
  actionVerbCount: number;
  quantifiedMetricsCount: number;
}

export type QuestionCategory =
  | 'SQL & Database Queries'
  | 'Data Structures'
  | 'DSA & Algorithms'
  | 'OOPs & Design Patterns'
  | 'Operating Systems'
  | 'Computer Networks'
  | 'DBMS & Database Concepts'
  | 'OS, Networks & DBMS'
  | 'System Design & Architecture'
  | 'Machine Learning & AI'
  | 'Project Deep-Dive'
  | 'Tech Stack'
  | 'Behavioral'
  | 'Resume Deep-Dive';

export type QuestionDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface InterviewQuestion {
  id: string;
  question: string;
  answer: string;
  keyTalkingPoints?: string[];
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  contextTag: string; // e.g. "Binary Trees", "SOLID Principles", "CAP Theorem", "Transformers", "OS Concurrency"
  isPinned?: boolean;
}

export interface ResumeAnalysisResult {
  parsedResume: ParsedResume;
  atsMetrics: ATSMetrics;
  questions: InterviewQuestion[];
  isAiGenerated?: boolean;
  aiModelName?: string;
}
