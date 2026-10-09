import type { Answers } from './types';

export type Question<K extends keyof Answers = keyof Answers> = {
  key: K;
  title: string;
  help?: string;
  options: { value: Answers[K]; label: string; detail?: string }[];
};

export const questions: Question[] = [
  {
    key: 'stage',
    title: 'What do you want to do next?',
    help: 'Pick the step you are aiming for, not the one you have finished.',
    options: [
      { value: 'bachelor', label: "Study a bachelor's degree" },
      { value: 'master', label: "Study a master's degree" },
      { value: 'phd', label: 'Do a PhD' },
      { value: 'postdoc', label: 'Work as a postdoctoral researcher' },
      { value: 'faculty', label: 'Get a university faculty position' },
      { value: 'school_teacher', label: 'Teach in schools' },
      { value: 'edu_professional', label: 'Work in the education sector', detail: 'International schools, language teaching, education research institutes' },
    ],
  },
  {
    key: 'education',
    title: 'What is your highest completed (or soon completed) qualification?',
    options: [
      { value: 'high_school', label: 'Secondary school diploma' },
      { value: 'bachelor', label: "Bachelor's degree" },
      { value: 'master', label: "Master's degree" },
      { value: 'phd', label: 'PhD' },
    ],
  },
  {
    key: 'area',
    title: 'Which part of education and research interests you most?',
    options: [
      { value: 'education', label: 'Education, pedagogy and teaching' },
      { value: 'stem', label: 'Science, engineering and technology' },
      { value: 'humanities', label: 'Humanities and social sciences' },
      { value: 'life_sciences', label: 'Life sciences and health' },
      { value: 'unsure', label: 'Not sure yet' },
    ],
  },
  {
    key: 'objective',
    title: 'Where do you want to be in five to ten years?',
    options: [
      { value: 'academic_career', label: 'Building an academic career' },
      { value: 'industry_research', label: 'Doing research in industry' },
      { value: 'teaching', label: 'Teaching' },
      { value: 'return_home', label: 'Back home, with international experience' },
      { value: 'settle_europe', label: 'Settled long term in Europe' },
    ],
  },
  {
    key: 'italian',
    title: 'How well do you speak Italian?',
    options: [
      { value: 'none', label: 'Not at all' },
      { value: 'basic', label: 'Basic (A1 to A2)' },
      { value: 'intermediate', label: 'Intermediate (B1 to B2)' },
      { value: 'fluent', label: 'Fluent (C1 or above)' },
    ],
  },
  {
    key: 'english',
    title: 'How well do you speak English?',
    options: [
      { value: 'none', label: 'Not at all' },
      { value: 'basic', label: 'Basic (A1 to A2)' },
      { value: 'intermediate', label: 'Intermediate (B1 to B2)' },
      { value: 'fluent', label: 'Fluent (C1 or above)' },
    ],
  },
  {
    key: 'budget',
    title: 'How will you pay for it?',
    options: [
      { value: 'full_funding', label: 'I need full funding or a salary' },
      { value: 'some', label: 'I can cover part of the costs' },
      { value: 'self_funded', label: 'I can pay my own way' },
    ],
  },
  {
    key: 'citizenship',
    title: 'Are you a citizen of an EU or EEA country (or Switzerland)?',
    help: 'This decides whether you need a visa.',
    options: [
      { value: 'eu', label: 'Yes' },
      { value: 'non_eu', label: 'No' },
    ],
  },
];

const keys = questions.map((q) => q.key);

export function encodeAnswers(a: Answers): string {
  return keys.map((k) => a[k]).join('.');
}

export function decodeAnswers(s: string | undefined): Answers | null {
  if (!s) return null;
  const parts = s.split('.');
  if (parts.length !== keys.length) return null;
  const out: Record<string, string> = {};
  for (let i = 0; i < keys.length; i++) {
    const q = questions[i];
    if (!q.options.some((o) => o.value === parts[i])) return null;
    out[keys[i]] = parts[i];
  }
  return out as Answers;
}

export function labelFor<K extends keyof Answers>(key: K, value: Answers[K]): string {
  const q = questions.find((x) => x.key === key);
  return q?.options.find((o) => o.value === value)?.label ?? String(value);
}
