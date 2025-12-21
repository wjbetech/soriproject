import { useMemo } from "react";
import useAppStore from "../store/useAppStore";
import generalData from "../data/general.json";
import animalsData from "../data/animals.json";
import manhwaData from "../data/manhwa.json";

const minFilterChars = 1; // threshold for filtering the currently displayed table (allow single-char filter)
const minSuggestChars = 1; // threshold for showing suggestion results (skeleton until 1 char)
const maxSuggestions = 8;

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

// (removed unused scoreMatch helper) - scoring is done by scoreMatchFields which considers
// term, keywords, animal, and description with per-field weighting.

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
  const addRecent = useAppStore((s) => s.addRecent);
  const recent = useAppStore((s) => s.recent);
  const setCategory = useAppStore((s) => s.setCategory);

  // results used for filtering the currently displayed table (only after minFilterChars)
  const results = useMemo(() => {
    if (!searchTerm || searchTerm.length < minFilterChars) return [];
    // build list of items for the selected category
    const itemsByCategory = {
      General: generalData,
      Animals: animalsData,
      Manhwa: manhwaData
    };
    const list = itemsByCategory[category] || [];

    const matchesItem = (item, q) => {
      if (!item) return false;
      if (fuzzyIncludes(item.term, q)) return true;
      if (item.keywords && item.keywords.some((k) => fuzzyIncludes(k, q))) return true;
      if (item.animal && fuzzyIncludes(item.animal, q)) return true;
      if (item.description && fuzzyIncludes(item.description, q)) return true;
      return false;
    };

    return list.filter((it) => matchesItem(it, searchTerm)).map((it) => it.term);
  }, [searchTerm, category]);

  // whether table filtering is currently active (search term meets threshold)
  const filterActive = Boolean(searchTerm && searchTerm.length >= minFilterChars);

  // build a combined dataset with metadata for suggestions
  const combined = useMemo(() => {
    return [
      ...generalData.map((d) => ({ ...d, category: "General" })),
      ...animalsData.map((d) => ({ ...d, category: "Animals" })),
      ...manhwaData.map((d) => ({ ...d, category: "Manhwa" }))
    ];
  }, []);

  function buildIndex(items) {
    return items.map((item) => ({
      ...item,
      _norm: normalizeForSearch([item.term, item.description, item.animal || "", ...(item.keywords || [])].join(" "))
    }));
  }

  function scoreMatchFields(item, q) {
    const qn = normalizeForSearch(q);
    // higher weight if matches term exactly / startsWith
    if (normalizeForSearch(item.term).startsWith(qn)) return 100;
    // keywords match
    for (const k of item.keywords || []) {
      if (normalizeForSearch(k).includes(qn)) return 80;
    }
    // animal / description / subsequence / fuzzy fallback
    if (item.animal && fuzzyIncludes(item.animal, q)) return 60;
    if (fuzzyIncludes(item.description, q)) return 50;
    if (fuzzyIncludes(item._norm, qn)) return 30;
    return 0;
  }

  const suggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < minSuggestChars) return [];
    const idx = buildIndex(combined);
    // Only include reasonably relevant matches (score threshold) to avoid noisy results
    const scored = idx
      .map((item) => ({ item, score: scoreMatchFields(item, searchTerm) }))
      .filter(({ score }) => score >= 50)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score; // higher score first
        return a.item.term.length - b.item.term.length; // shorter terms first
      })
      .slice(0, maxSuggestions)
      .map(({ item }) => item);
    return scored;
  }, [searchTerm, combined]);

  const showSkeleton = !searchTerm || searchTerm.length < minSuggestChars;

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
