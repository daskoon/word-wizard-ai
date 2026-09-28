export const BOARD_SIZE = 11;

export const WWF_LETTER_VALUES: Record<string, number> = {
  'A': 1, 'B': 4, 'C': 4, 'D': 2, 'E': 1, 'F': 4, 'G': 3, 'H': 3,
  'I': 1, 'J': 10, 'K': 5, 'L': 2, 'M': 4, 'N': 2, 'O': 1, 'P': 4,
  'Q': 10, 'R': 1, 'S': 1, 'T': 1, 'U': 2, 'V': 5, 'W': 4, 'X': 8,
  'Y': 3, 'Z': 10, '?': 0, ' ': 0
};

/**
 * 11x11 Solo Challenge Layout
 */
export const PREMIUM_MAP: Record<string, string> = {
  // Corners
  '0,0': 'TL', '0,10': 'TL', '10,0': 'TL', '10,10': 'TL',
  
  // Mid-Edges
  '0,5': 'TW', '5,0': 'TW', '5,10': 'TW', '10,5': 'TW',

  // Inner Ring
  '1,1': 'DW', '1,9': 'DW', '9,1': 'DW', '9,9': 'DW',
  '2,2': 'DL', '2,8': 'DL',
  '3,3': 'TL', '3,7': 'TL',
  '4,4': 'DL', '4,6': 'DL',

  // Outer Cross
  '2,5': 'TL', '5,2': 'TL', '5,8': 'TL', '8,5': 'TL',

  // Center
  '5,5': 'DW', 
  
  // Symmetrical components
  '6,4': 'DL', '6,6': 'DL',
  '7,3': 'TL', '7,7': 'TL',
  '8,2': 'DL', '8,8': 'DL',
};
