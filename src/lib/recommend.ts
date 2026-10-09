import { countries } from '../data/italy';
import type { Answers, Assessment, Country, Pathway } from '../data/types';

export type RankedPathway = { pathway: Pathway; assessment: Assessment };

export type CountryResult = {
  country: Country;
  fit: number;
  verdict: string;
  ranked: RankedPathway[];
  notEligible: RankedPathway[];
};

export function verdictFor(fit: number): string {
  if (fit >= 75) return 'Strong match';
  if (fit >= 55) return 'Good match';
  if (fit >= 35) return 'Possible, with some work';
  return 'Weak match for now';
}

export function recommendCountry(country: Country, answers: Answers): CountryResult {
  const all = country.pathways.map((pathway) => ({ pathway, assessment: pathway.assess(answers) }));
  const ranked = all.filter((r) => r.assessment.eligible).sort((x, y) => y.assessment.score - x.assessment.score);
  const notEligible = all.filter((r) => !r.assessment.eligible);
  // A country's fit is driven by its best route, with a small bonus when there is a good second option.
  const best = ranked[0]?.assessment.score ?? 0;
  const second = ranked[1]?.assessment.score ?? 0;
  const fit = Math.min(100, Math.round(best + (second >= 50 ? 5 : 0)));
  return { country, fit, verdict: verdictFor(fit), ranked, notEligible };
}

export function recommend(answers: Answers): CountryResult[] {
  return countries.map((c) => recommendCountry(c, answers)).sort((a, b) => b.fit - a.fit);
}

export function findPathway(countryId: string, pathwayId: string) {
  const country = countries.find((c) => c.id === countryId);
  const pathway = country?.pathways.find((p) => p.id === pathwayId);
  return country && pathway ? { country, pathway } : null;
}
