export type Stage =
  | 'bachelor'
  | 'master'
  | 'phd'
  | 'postdoc'
  | 'faculty'
  | 'school_teacher'
  | 'edu_professional';

export type Education = 'high_school' | 'bachelor' | 'master' | 'phd';

export type Area = 'education' | 'stem' | 'humanities' | 'life_sciences' | 'unsure';

export type Objective =
  | 'academic_career'
  | 'industry_research'
  | 'teaching'
  | 'return_home'
  | 'settle_europe';

export type LanguageLevel = 'none' | 'basic' | 'intermediate' | 'fluent';

export type Budget = 'full_funding' | 'some' | 'self_funded';

export type Citizenship = 'eu' | 'non_eu';

export type Answers = {
  stage: Stage;
  education: Education;
  area: Area;
  objective: Objective;
  italian: LanguageLevel;
  english: LanguageLevel;
  budget: Budget;
  citizenship: Citizenship;
};

export type Link = { label: string; url: string };

export type Assessment = {
  /** 0 to 100. Below 0 after clamping means not eligible. */
  score: number;
  eligible: boolean;
  reasons: string[];
  cautions: string[];
};

export type Pathway = {
  id: string;
  title: string;
  kind: 'study' | 'research' | 'work';
  summary: string;
  requirements: string[];
  costs: string;
  funding: string[];
  timeline: string[];
  steps: string[];
  links: Link[];
  assess: (a: Answers) => Assessment;
};

export type Institution = { name: string; city: string; note: string; url: string };

export type Country = {
  id: string;
  name: string;
  flag: string;
  /** Short general facts shown on the results screen. */
  essentials: { title: string; body: string }[];
  institutionsByArea: Record<Area, Institution[]>;
  visa: Record<Citizenship, string[]>;
  pathways: Pathway[];
  lastReviewed: string;
};
