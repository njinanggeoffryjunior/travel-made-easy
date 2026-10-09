import type { Assessment, Education, LanguageLevel } from '../data/types';

export const langRank: Record<LanguageLevel, number> = { none: 0, basic: 1, intermediate: 2, fluent: 3 };
export const eduRank: Record<Education, number> = { high_school: 0, bachelor: 1, master: 2, phd: 3 };

/** Small helper so each pathway's rules read as a list of plain sentences. */
export function scorer(base = 30) {
  let score = base;
  let eligible = true;
  const reasons: string[] = [];
  const cautions: string[] = [];
  return {
    plus(points: number, reason: string) {
      score += points;
      reasons.push(reason);
    },
    minus(points: number, caution: string) {
      score -= points;
      cautions.push(caution);
    },
    block(caution: string) {
      eligible = false;
      cautions.unshift(caution);
    },
    done(): Assessment {
      return { score: Math.max(0, Math.min(100, Math.round(score))), eligible, reasons, cautions };
    },
  };
}
