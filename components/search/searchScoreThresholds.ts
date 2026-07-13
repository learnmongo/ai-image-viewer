/** Text-only Atlas `searchScore` — below this the badge is hidden (results are still shown). */
const TEXT_BADGE_MIN_SEARCH_SCORE = 1;

/** Text-only search: hide the score pill when Atlas score is weak. */
export function shouldShowTextSearchScoreBadge(score: number | undefined): boolean {
  if (typeof score !== 'number' || !Number.isFinite(score)) return false;
  return score >= TEXT_BADGE_MIN_SEARCH_SCORE;
}
