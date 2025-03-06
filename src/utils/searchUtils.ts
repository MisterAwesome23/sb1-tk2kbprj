// Calculates Levenshtein distance between two strings
export function levenshteinDistance(str1: string, str2: string): number {
  const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) track[0][i] = i;
  for (let j = 0; j <= str2.length; j++) track[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }

  return track[str2.length][str1.length];
}

// Checks if a string matches with fuzzy search
export function fuzzyMatch(text: string, query: string, threshold = 0.3): boolean {
  if (!query) return true;
  if (!text) return false;

  text = text.toLowerCase();
  query = query.toLowerCase();

  // Direct substring match
  if (text.includes(query)) return true;

  // Split query into words and check each
  const words = query.split(/\s+/);
  
  return words.every(word => {
    // Check for common variations
    const variations = getWordVariations(word);
    
    return variations.some(variant => {
      const distance = levenshteinDistance(variant, text);
      const maxLength = Math.max(variant.length, text.length);
      const similarity = 1 - distance / maxLength;
      return similarity > threshold;
    });
  });
}

// Generate common variations of a word
function getWordVariations(word: string): string[] {
  const variations = [word];
  
  // Common typos and variations
  if (word.endsWith('ing')) {
    variations.push(word.slice(0, -3));
    variations.push(word.slice(0, -3) + 'er');
  }
  
  if (word.endsWith('er')) {
    variations.push(word.slice(0, -2));
    variations.push(word.slice(0, -2) + 'ing');
  }

  // Handle common plural/singular variations
  if (word.endsWith('s')) {
    variations.push(word.slice(0, -1));
  } else {
    variations.push(word + 's');
  }

  return variations;
}