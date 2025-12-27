// Rule-based content enhancement engine - no external AI needed

const ACTION_VERBS = {
  leadership: ['Led', 'Directed', 'Managed', 'Supervised', 'Coordinated', 'Orchestrated', 'Spearheaded', 'Championed'],
  achievement: ['Achieved', 'Exceeded', 'Surpassed', 'Delivered', 'Accomplished', 'Attained', 'Earned', 'Won'],
  creation: ['Created', 'Developed', 'Designed', 'Built', 'Established', 'Launched', 'Initiated', 'Pioneered'],
  improvement: ['Improved', 'Enhanced', 'Optimized', 'Streamlined', 'Revamped', 'Transformed', 'Modernized', 'Upgraded'],
  analysis: ['Analyzed', 'Evaluated', 'Assessed', 'Researched', 'Investigated', 'Examined', 'Identified', 'Discovered'],
  communication: ['Presented', 'Communicated', 'Collaborated', 'Negotiated', 'Facilitated', 'Articulated', 'Advocated'],
  technical: ['Implemented', 'Engineered', 'Programmed', 'Configured', 'Integrated', 'Automated', 'Deployed', 'Architected'],
};

const WEAK_PHRASES: Record<string, string[]> = {
  'worked on': ['Developed', 'Implemented', 'Built', 'Created'],
  'helped with': ['Contributed to', 'Supported', 'Assisted in', 'Collaborated on'],
  'was responsible for': ['Managed', 'Led', 'Oversaw', 'Directed'],
  'did': ['Executed', 'Performed', 'Completed', 'Delivered'],
  'made': ['Created', 'Developed', 'Produced', 'Generated'],
  'used': ['Utilized', 'Leveraged', 'Applied', 'Employed'],
  'got': ['Achieved', 'Obtained', 'Secured', 'Earned'],
  'worked with': ['Collaborated with', 'Partnered with', 'Coordinated with'],
  'in charge of': ['Managed', 'Directed', 'Led', 'Oversaw'],
  'dealt with': ['Handled', 'Managed', 'Addressed', 'Resolved'],
};

const ROLE_KEYWORDS: Record<string, string[]> = {
  developer: ['software development', 'programming', 'debugging', 'code review', 'agile', 'version control', 'APIs', 'testing'],
  designer: ['UI/UX', 'wireframing', 'prototyping', 'user research', 'visual design', 'design systems', 'accessibility'],
  manager: ['project management', 'team leadership', 'stakeholder management', 'budgeting', 'strategic planning', 'performance reviews'],
  marketing: ['digital marketing', 'SEO', 'content strategy', 'analytics', 'campaign management', 'brand awareness', 'social media'],
  sales: ['revenue growth', 'client acquisition', 'pipeline management', 'negotiation', 'CRM', 'account management', 'B2B'],
  analyst: ['data analysis', 'reporting', 'visualization', 'SQL', 'business intelligence', 'forecasting', 'KPIs'],
  engineer: ['system design', 'infrastructure', 'optimization', 'troubleshooting', 'documentation', 'scalability'],
  consultant: ['client relations', 'problem-solving', 'recommendations', 'presentations', 'industry expertise', 'strategy'],
};

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function enhanceBulletPoint(bullet: string, role?: string): string {
  let enhanced = bullet.trim();
  
  // Replace weak phrases with strong action verbs
  for (const [weak, replacements] of Object.entries(WEAK_PHRASES)) {
    const regex = new RegExp(`^${weak}\\b`, 'i');
    if (regex.test(enhanced)) {
      enhanced = enhanced.replace(regex, getRandomItem(replacements));
    }
  }
  
  // Ensure starts with action verb
  const firstWord = enhanced.split(' ')[0].toLowerCase();
  const allVerbs = Object.values(ACTION_VERBS).flat().map(v => v.toLowerCase());
  
  if (!allVerbs.includes(firstWord)) {
    // Pick appropriate verb category based on content
    let verbCategory = 'achievement';
    if (enhanced.toLowerCase().includes('team') || enhanced.toLowerCase().includes('lead')) {
      verbCategory = 'leadership';
    } else if (enhanced.toLowerCase().includes('create') || enhanced.toLowerCase().includes('build') || enhanced.toLowerCase().includes('develop')) {
      verbCategory = 'creation';
    } else if (enhanced.toLowerCase().includes('improve') || enhanced.toLowerCase().includes('increase') || enhanced.toLowerCase().includes('reduce')) {
      verbCategory = 'improvement';
    } else if (enhanced.toLowerCase().includes('analyze') || enhanced.toLowerCase().includes('research')) {
      verbCategory = 'analysis';
    } else if (enhanced.toLowerCase().includes('code') || enhanced.toLowerCase().includes('implement') || enhanced.toLowerCase().includes('deploy')) {
      verbCategory = 'technical';
    }
    
    const verb = getRandomItem(ACTION_VERBS[verbCategory as keyof typeof ACTION_VERBS]);
    enhanced = `${verb} ${enhanced.charAt(0).toLowerCase()}${enhanced.slice(1)}`;
  }
  
  // Capitalize first letter
  enhanced = capitalizeFirst(enhanced);
  
  // Remove trailing period if present, add if missing
  enhanced = enhanced.replace(/\.+$/, '');
  
  return enhanced;
}

export function enhanceSummary(summary: string, role?: string, level?: string): string {
  let enhanced = summary.trim();
  
  // Replace weak phrases
  for (const [weak, replacements] of Object.entries(WEAK_PHRASES)) {
    const regex = new RegExp(weak, 'gi');
    enhanced = enhanced.replace(regex, getRandomItem(replacements));
  }
  
  // Add role keywords if they're missing
  if (role && ROLE_KEYWORDS[role]) {
    const keywords = ROLE_KEYWORDS[role];
    const hasKeyword = keywords.some(kw => enhanced.toLowerCase().includes(kw.toLowerCase()));
    if (!hasKeyword && enhanced.length < 300) {
      // Don't add keywords, just note it for suggestions
    }
  }
  
  return enhanced;
}

export function generateSuggestions(text: string, role?: string): string[] {
  const suggestions: string[] = [];
  const lowerText = text.toLowerCase();
  
  // Check for metrics
  if (!/\d+%|\$\d+|\d+ (users|customers|projects|team members)/i.test(text)) {
    suggestions.push('Add quantifiable metrics (e.g., "Increased sales by 25%", "Managed team of 5")');
  }
  
  // Check for action verbs
  const allVerbs = Object.values(ACTION_VERBS).flat().map(v => v.toLowerCase());
  const hasActionVerb = allVerbs.some(v => lowerText.startsWith(v.toLowerCase()));
  if (!hasActionVerb) {
    suggestions.push('Start with a strong action verb (e.g., "Led", "Developed", "Achieved")');
  }
  
  // Check length
  if (text.length < 50) {
    suggestions.push('Add more detail to strengthen this point');
  } else if (text.length > 200) {
    suggestions.push('Consider making this more concise for better readability');
  }
  
  // Role-specific suggestions
  if (role && ROLE_KEYWORDS[role]) {
    const keywords = ROLE_KEYWORDS[role];
    const missingKeywords = keywords.filter(kw => !lowerText.includes(kw.toLowerCase()));
    if (missingKeywords.length > 0 && missingKeywords.length < keywords.length) {
      suggestions.push(`Consider mentioning: ${missingKeywords.slice(0, 3).join(', ')}`);
    }
  }
  
  return suggestions;
}

export function generateProfessionalSummary(
  name: string,
  title: string,
  yearsExp: number,
  role: string,
  skills: string[]
): string {
  const levelDescriptor = yearsExp < 2 
    ? 'motivated and detail-oriented' 
    : yearsExp < 5 
    ? 'results-driven' 
    : yearsExp < 10 
    ? 'experienced and accomplished' 
    : 'seasoned and strategic';
  
  const topSkills = skills.slice(0, 3).join(', ');
  
  const templates = [
    `${levelDescriptor} ${title} with ${yearsExp > 0 ? `${yearsExp}+ years of` : 'demonstrated'} experience in ${topSkills || 'the field'}. Proven track record of delivering high-quality results and driving continuous improvement. Passionate about leveraging technical expertise to solve complex problems and contribute to team success.`,
    `${levelDescriptor} professional specializing in ${title.toLowerCase()} with expertise in ${topSkills || 'key industry areas'}. ${yearsExp > 0 ? `Brings ${yearsExp}+ years of hands-on experience` : 'Combines strong foundational knowledge'} with a commitment to excellence and innovation. Adept at collaborating with cross-functional teams to achieve organizational objectives.`,
    `Dynamic ${title} ${yearsExp > 0 ? `with ${yearsExp}+ years of progressive experience` : 'eager to apply skills and knowledge'} in ${topSkills || 'the industry'}. Known for ${levelDescriptor} approach to problem-solving and ability to deliver measurable results. Committed to continuous learning and professional development.`,
  ];
  
  return getRandomItem(templates);
}

export const ACTION_VERB_CATEGORIES = ACTION_VERBS;
export const ROLE_SPECIFIC_KEYWORDS = ROLE_KEYWORDS;
