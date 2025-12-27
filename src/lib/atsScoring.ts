import { ResumeData, ATSScore, CareerRole } from '@/types/resume';
import { ACTION_VERB_CATEGORIES, ROLE_SPECIFIC_KEYWORDS } from './contentEnhancer';

const SECTION_WEIGHTS = {
  personalInfo: 15,
  summary: 15,
  workExperience: 25,
  education: 15,
  skills: 15,
  projects: 10,
  certifications: 5,
};

function countActionVerbs(text: string): number {
  const allVerbs = Object.values(ACTION_VERB_CATEGORIES).flat();
  const words = text.split(/\s+/);
  let count = 0;
  
  for (const word of words) {
    const cleanWord = word.replace(/[^a-zA-Z]/g, '');
    if (allVerbs.some(v => v.toLowerCase() === cleanWord.toLowerCase())) {
      count++;
    }
  }
  
  return count;
}

function countRoleKeywords(text: string, role: CareerRole): number {
  const keywords = ROLE_SPECIFIC_KEYWORDS[role] || [];
  let count = 0;
  
  for (const keyword of keywords) {
    const regex = new RegExp(keyword, 'gi');
    const matches = text.match(regex);
    if (matches) {
      count += matches.length;
    }
  }
  
  return count;
}

function assessBulletQuality(bullets: string[]): number {
  if (bullets.length === 0) return 0;
  
  let score = 0;
  
  for (const bullet of bullets) {
    let bulletScore = 0;
    
    // Check for action verb at start
    const allVerbs = Object.values(ACTION_VERB_CATEGORIES).flat();
    const firstWord = bullet.split(' ')[0].replace(/[^a-zA-Z]/g, '');
    if (allVerbs.some(v => v.toLowerCase() === firstWord.toLowerCase())) {
      bulletScore += 30;
    }
    
    // Check for metrics/numbers
    if (/\d+%|\$\d+|\d+\+?/.test(bullet)) {
      bulletScore += 30;
    }
    
    // Check length (ideal: 50-150 chars)
    if (bullet.length >= 50 && bullet.length <= 150) {
      bulletScore += 25;
    } else if (bullet.length >= 30 && bullet.length <= 200) {
      bulletScore += 15;
    }
    
    // Check for specificity
    if (/using|with|by|through|via/i.test(bullet)) {
      bulletScore += 15;
    }
    
    score += Math.min(bulletScore, 100);
  }
  
  return Math.round(score / bullets.length);
}

function calculateCompleteness(resume: ResumeData): number {
  let filledSections = 0;
  const totalSections = 6;
  
  // Personal info
  const { personalInfo } = resume;
  if (personalInfo.fullName && personalInfo.email && personalInfo.phone && personalInfo.title) {
    filledSections += 1;
  }
  
  // Summary
  if (resume.summary && resume.summary.length >= 50) {
    filledSections += 1;
  }
  
  // Work experience
  if (resume.workExperience.length > 0) {
    const hasDescriptions = resume.workExperience.some(
      w => w.bullets.length > 0 || w.description.length > 0
    );
    if (hasDescriptions) {
      filledSections += 1;
    }
  }
  
  // Education
  if (resume.education.length > 0) {
    filledSections += 1;
  }
  
  // Skills
  if (resume.skills.length > 0) {
    const totalSkills = resume.skills.reduce((acc, s) => acc + s.skills.length, 0);
    if (totalSkills >= 5) {
      filledSections += 1;
    }
  }
  
  // Projects or certifications
  if (resume.projects.length > 0 || resume.certifications.length > 0) {
    filledSections += 1;
  }
  
  return Math.round((filledSections / totalSections) * 100);
}

export function calculateATSScore(resume: ResumeData, role: CareerRole): ATSScore {
  const suggestions: string[] = [];
  
  // Collect all text for analysis
  const allText = [
    resume.summary,
    ...resume.workExperience.flatMap(w => [w.description, ...w.bullets]),
    ...resume.education.flatMap(e => e.highlights),
    ...resume.projects.flatMap(p => [p.description, ...p.bullets]),
  ].join(' ');
  
  // Calculate individual scores
  const actionVerbCount = countActionVerbs(allText);
  const actionVerbScore = Math.min(Math.round((actionVerbCount / 15) * 100), 100);
  
  if (actionVerbCount < 5) {
    suggestions.push('Add more action verbs to your bullet points (aim for 15+)');
  }
  
  const keywordCount = countRoleKeywords(allText, role);
  const keywordScore = Math.min(Math.round((keywordCount / 10) * 100), 100);
  
  if (keywordCount < 5) {
    suggestions.push(`Include more ${role}-specific keywords in your resume`);
  }
  
  // Length score (ideal: 400-800 words for one page)
  const wordCount = allText.split(/\s+/).filter(w => w.length > 0).length;
  let lengthScore = 100;
  
  if (wordCount < 200) {
    lengthScore = 40;
    suggestions.push('Your resume is too short. Add more detail to your experiences');
  } else if (wordCount < 300) {
    lengthScore = 60;
    suggestions.push('Consider adding more content to fill out your resume');
  } else if (wordCount > 800) {
    lengthScore = 70;
    suggestions.push('Your resume may be too long. Consider condensing for a one-page format');
  } else if (wordCount > 600) {
    lengthScore = 90;
  }
  
  const completeness = calculateCompleteness(resume);
  
  if (completeness < 80) {
    if (!resume.summary || resume.summary.length < 50) {
      suggestions.push('Add a professional summary (50-150 words)');
    }
    if (resume.workExperience.length === 0) {
      suggestions.push('Add work experience with bullet points');
    }
    if (resume.skills.length === 0) {
      suggestions.push('Add a skills section with relevant abilities');
    }
  }
  
  // Bullet quality
  const allBullets = [
    ...resume.workExperience.flatMap(w => w.bullets),
    ...resume.projects.flatMap(p => p.bullets),
  ];
  const bulletQuality = allBullets.length > 0 ? assessBulletQuality(allBullets) : 0;
  
  if (bulletQuality < 60 && allBullets.length > 0) {
    suggestions.push('Improve bullet points with metrics and specific achievements');
  }
  
  // Calculate overall score
  const overall = Math.round(
    (actionVerbScore * 0.2) +
    (keywordScore * 0.15) +
    (lengthScore * 0.15) +
    (completeness * 0.3) +
    (bulletQuality * 0.2)
  );
  
  // Add general suggestions
  const { personalInfo } = resume;
  if (!personalInfo.linkedin) {
    suggestions.push('Add a LinkedIn profile URL');
  }
  
  if (resume.certifications.length === 0) {
    suggestions.push('Consider adding relevant certifications');
  }
  
  return {
    overall,
    actionVerbs: actionVerbScore,
    keywords: keywordScore,
    length: lengthScore,
    completeness,
    bulletQuality,
    suggestions: suggestions.slice(0, 5),
  };
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-warning';
  return 'text-destructive';
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Great';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 50) return 'Needs Work';
  return 'Poor';
}
