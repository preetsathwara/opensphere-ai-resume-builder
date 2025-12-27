export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  title: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  highlights: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  bullets: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface Skill {
  id: string;
  category: string;
  skills: string[];
}

export interface ResumeData {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  personalInfo: PersonalInfo;
  summary: string;
  workExperience: WorkExperience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  skills: Skill[];
  sectionOrder: string[];
}

export type TemplateType = 'minimal' | 'modern' | 'creative';

export type CareerLevel = 'student' | 'fresher' | 'professional' | 'senior' | 'executive';

export type CareerRole = 
  | 'developer' 
  | 'designer' 
  | 'manager' 
  | 'marketing' 
  | 'sales' 
  | 'analyst' 
  | 'engineer' 
  | 'consultant' 
  | 'other';

export interface ResumeSettings {
  template: TemplateType;
  careerLevel: CareerLevel;
  careerRole: CareerRole;
  atsMode: boolean;
}

export interface ATSScore {
  overall: number;
  actionVerbs: number;
  keywords: number;
  length: number;
  completeness: number;
  bulletQuality: number;
  suggestions: string[];
}

export const DEFAULT_RESUME_DATA: ResumeData = {
  id: crypto.randomUUID(),
  name: 'My Resume',
  createdAt: new Date(),
  updatedAt: new Date(),
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    title: '',
  },
  summary: '',
  workExperience: [],
  education: [],
  projects: [],
  certifications: [],
  skills: [],
  sectionOrder: ['summary', 'workExperience', 'education', 'skills', 'projects', 'certifications'],
};

export const DEFAULT_SETTINGS: ResumeSettings = {
  template: 'minimal',
  careerLevel: 'professional',
  careerRole: 'developer',
  atsMode: true,
};
