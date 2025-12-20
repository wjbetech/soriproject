import { useMemo } from "react";
import useAppStore from "../store/useAppStore";
import generalData from "../data/general.json";
import animalsData from "../data/animals.json";
import manhwaData from "../data/manhwa.json";

const MIN_FILTER_CHARS = 1; // threshold for filtering the currently displayed table (allow single-char filter)
const MIN_SUGGEST_CHARS = 1; // threshold for showing suggestion results (skeleton until 1 char)
const MAX_SUGGESTIONS = 8;

// Normalize strings for better fuzzy matching. Use NFD so Hangul syllables decompose into jamo
// making partial inputs like '살라' match '살랑살랑'. Also strip whitespace and lowercase.
function normalizeForSearch(str) {
  if (!str) return "";
  try {
    return String(str).normalize("NFD").toLowerCase().replace(/\s+/g, "");
  } catch {
    return String(str).toLowerCase().replace(/\s+/g, "");
  }
}

function isSubsequence(needle, haystack) {
  let i = 0;
  for (const ch of haystack) {
    if (ch === needle[i]) i++;
    if (i === needle.length) return true;
  }
  return needle.length === 0;
}

function scoreMatch(term, q) {
  const t = normalizeForSearch(term);
  const s = normalizeForSearch(q);
  if (t === s) return 0;
  if (t.startsWith(s)) return 1;
  if (t.includes(s)) return 2;
  if (isSubsequence(s, t)) return 3;
  // fallback: small edit distance check
  // simple levenshtein-ish distance can be approximated by length difference for short terms
  const lenDiff = Math.abs(t.length - s.length);
  if (lenDiff <= 1) return 4;
  return 5;
}

function editDistance(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function fuzzyIncludes(target, query) {
  const t = normalizeForSearch(target);
  const q = normalizeForSearch(query);
  if (!q) return false;
  if (t.includes(q)) return true;
  if (isSubsequence(q, t)) return true;
  const qlen = q.length;
  // check substrings of t with length qlen-1..qlen+1 for small edit distance
  for (let len = Math.max(1, qlen - 1); len <= Math.min(t.length, qlen + 1); len++) {
    for (let i = 0; i + len <= t.length; i++) {
      const sub = t.slice(i, i + len);
      if (editDistance(sub, q) <= 1) return true;
    }
  }
  return false;
}

export default function useSearch() {
  const searchTerm = useAppStore((s) => s.searchTerm);
  const setSearch = useAppStore((s) => s.setSearch);
  const category = useAppStore((s) => s.category);
  const wordsByCategory = useAppStore((s) => s.wordsByCategory);
  const addRecent = useAppStore((s) => s.addRecent);
  const recent = useAppStore((s) => s.recent);
  const setCategory = useAppStore((s) => s.setCategory);

  // results used for filtering the currently displayed table (only after MIN_FILTER_CHARS)
  const results = useMemo(() => {
    if (!searchTerm || searchTerm.length < MIN_FILTER_CHARS) return [];
    const list = (wordsByCategory && wordsByCategory[category]) || [];
    return list.filter((w) => fuzzyIncludes(w, searchTerm));
  }, [searchTerm, category, wordsByCategory]);

  // whether table filtering is currently active (search term meets threshold)
  const filterActive = Boolean(searchTerm && searchTerm.length >= MIN_FILTER_CHARS);

  // build a combined dataset with metadata for suggestions
  const combined = useMemo(() => {
    return [
      ...generalData.map((d) => ({ ...d, category: "General" })),
      ...animalsData.map((d) => ({ ...d, category: "Animals" })),
      ...manhwaData.map((d) => ({ ...d, category: "Manhwa" }))
    ];
  }, []);

  const suggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < MIN_SUGGEST_CHARS) return [];
    const q = searchTerm.toLowerCase();
    const scored = combined
      .map((item) => ({ item, score: scoreMatch(item.term, q) }))
      .filter(({ score }) => score < 4)
      .sort((a, b) => {
        if (a.score !== b.score) return a.score - b.score;
        // tie-breaker: shorter terms first
        return a.item.term.length - b.item.term.length;
      })
      .slice(0, MAX_SUGGESTIONS)
      .map(({ item }) => item);
    return scored;
  }, [searchTerm, combined]);

  const showSkeleton = !searchTerm || searchTerm.length < MIN_SUGGEST_CHARS;

  const submit = (term) => {
    setSearch(term);
    addRecent(term);
  };

  const selectSuggestion = (term, cat) => {
    setSearch(term);
    setCategory(cat);
    addRecent(term);
  };

  return { searchTerm, setSearch, results, submit, recent, suggestions, selectSuggestion, showSkeleton, filterActive };
}
