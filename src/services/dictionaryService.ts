

// Basic in-memory dictionary cache
let wordSet: Set<string> | null = null;

// Standard ENABLE list (base for WWF)
const WORD_LIST_URL = 'https://raw.githubusercontent.com/dolph/dictionary/master/enable1.txt';

// WWF specific words that might be missing from standard ENABLE
const WWF_WHITELIST = new Set([
  'QI', 'ZA', 'JA', 'JO', 'KI', 'EX', 'XI', 'XU', 'ZE', 'ZO', // 2-letter power words
  'ZEN', 'FEZ', 'WIZ', 'CAZ', 'REZ', // Common 3-letter Z words
  'QAT', 'QIS', 'QUA', 'SUQ', // Q words
  'VAV', 'VAVS', // V words
  'JEEZ', 'JINX', 'JAZZ'
]);

export const dictionaryService = {
  /**
   * Initialize the dictionary by fetching the word list.
   * Call this on app startup.
   */
  async init(): Promise<void> {
    if (wordSet) return; // Already loaded

    try {
      const response = await fetch(WORD_LIST_URL);
      if (!response.ok) throw new Error('Failed to load dictionary');
      const text = await response.text();
      // Split by newlines, trim, and uppercase
      const words = text.split('\n').map(w => w.trim().toUpperCase());
      wordSet = new Set(words);
      
      // Merge whitelist
      for (const w of WWF_WHITELIST) {
        wordSet.add(w);
      }
      
      console.log(`Dictionary loaded: ${wordSet.size} words (including WWF extras).`);
    } catch (err) {
      console.error('Dictionary init failed:', err);
      // Fallback to a tiny emergency list or just fail open?
      // For now, if it fails, we assume all words are valid (fail open) to not block the app.
      wordSet = new Set(); 
    }
  },

  /**
   * Check if a word exists in the dictionary.
   * Returns true if valid or if dictionary hasn't loaded yet (fail open).
   */
  isValid(word: string): boolean {
    if (!wordSet || wordSet.size === 0) return true; // Fail open if not loaded
    return wordSet.has(word.toUpperCase());
  },

  /**
   * Check status
   */
  isReady(): boolean {
    return !!wordSet && wordSet.size > 0;
  }
};
