import { GoogleGenAI, Type } from "@google/genai";
import type { Schema } from "@google/genai";
import type { AnalysisResult, BoardState } from "../types";
import { GameMode } from "../types";

// --- VISION PROTOCOL (HYBRID: STRING + COORDINATES) ---
const VISION_SYSTEM_INSTRUCTION = `
You are a Words With Friends Digitizer.
Analyze the screenshot of an 11x11 "Solo Challenge" game board.

Task:
1. Locate the 11x11 square grid. 
2. Identify the player's rack at the bottom.

Output strictly JSON with TWO formats for redundancy:
1. "boardString": A single 121-character string representing the board row-by-row (11x11). 
   - Use '.' for empty squares.
   - Use 'A-Z' for tiles.
2. "boardCoords": Array of detected tiles with coordinates. { "r": number, "c": number, "L": string }.
3. "rack": String of tiles on the rack.

Example: 
{
  "boardString": "...........S..........T..........................................................................................",
  "boardCoords": [{ "r": 5, "c": 5, "L": "S" }, { "r": 0, "c": 10, "L": "T" }],
  "rack": "ABCDEFG"
}
`;

const VISION_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    rack: { type: Type.STRING, description: "Rack tiles string" },
    boardString: { type: Type.STRING, description: "121-char board string representation" },
    boardCoords: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          r: { type: Type.INTEGER, description: "Row 0-10" },
          c: { type: Type.INTEGER, description: "Col 0-10" },
          L: { type: Type.STRING, description: "Letter (A-Z)" }
        },
        required: ["r", "c", "L"]
      }
    }
  },
  required: ["rack", "boardString", "boardCoords"]
};

// --- LOGIC AGENT CONFIG ---
const LOGIC_SYSTEM_INSTRUCTION = `
You are the WordWizard Grandmaster.
Find the highest-scoring legal move on the provided 11x11 board.

Constraints:
1. Lexicon: Use ONLY valid English words found in the Words With Friends dictionary.
2. Connection: New tiles MUST connect to at least one existing tile on the board.
3. Multipliers: DL (2x letter), TL (3x letter), DW (2x word), TW (3x word).
   - Premium squares apply ONLY to the letters you place THIS turn.
4. Cross-Words: You MUST calculate the score for the primary word and ALL secondary words created by the placement.
5. Mode Adherence:
   - 'maximize score': Find the highest possible points.
   - 'safer board': Avoid placing tiles next to TW/DW unless scoring high.
   - 'bingo hunting': Prioritize using all 7 rack tiles (+35 bonus).

Output strictly JSON.
`;

const MOVE_SCHEMA_PROPERTIES = {
  word: { type: Type.STRING },
  row: { type: Type.INTEGER },
  col: { type: Type.INTEGER },
  direction: { type: Type.STRING },
  usedFromRack: { type: Type.ARRAY, items: { type: Type.STRING } },
  textInstructions: { type: Type.STRING },
  score: {
    type: Type.OBJECT,
    properties: {
      base: { type: Type.INTEGER },
      letterBonuses: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            row: { type: Type.INTEGER },
            col: { type: Type.INTEGER },
            type: { type: Type.STRING },
            delta: { type: Type.INTEGER },
          }
        }
      },
      wordMultipliers: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            row: { type: Type.INTEGER },
            col: { type: Type.INTEGER },
            type: { type: Type.STRING },
            factor: { type: Type.INTEGER },
          }
        }
      },
      crosswords: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            positions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: { r: { type: Type.INTEGER }, c: { type: Type.INTEGER } }
              }
            },
            points: { type: Type.INTEGER }
          }
        }
      },
      bingoBonus: { type: Type.INTEGER },
      total: { type: Type.INTEGER },
    },
    required: ["base", "total", "bingoBonus", "letterBonuses", "wordMultipliers", "crosswords"]
  },
  strategy: { type: Type.ARRAY, items: { type: Type.STRING } },
  detailedStrategy: { type: Type.STRING }
};

const LOGIC_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    best: { type: Type.OBJECT, properties: MOVE_SCHEMA_PROPERTIES },
    alternatives: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: MOVE_SCHEMA_PROPERTIES } },
    nextRackAdvice: { type: Type.STRING }
  },
  required: ["best", "alternatives", "nextRackAdvice"]
};

export interface VisionResult {
  board: BoardState;
  rack: string;
}

export const scanFullScreenshot = async (
  boardBase64: string
): Promise<VisionResult> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("VITE_GEMINI_API_KEY is not defined");
  
  const ai = new GoogleGenAI({ apiKey });
  
  const parts = [
    { inlineData: { mimeType: "image/jpeg", data: boardBase64 } },
    { text: "Extract 11x11 board (String AND Coords) and rack." }
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash", 
    contents: { parts },
    config: {
      systemInstruction: VISION_SYSTEM_INSTRUCTION,
      temperature: 0.0,
      responseSchema: VISION_SCHEMA,
      responseMimeType: "application/json"
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Vision AI");

  try {
    const parsed = JSON.parse(text);
    const rackStr = parsed.rack;
    const boardTiles = parsed.boardCoords;
    const boardString = parsed.boardString;

    const boardState: BoardState = {};
    
    // PRIMARY STRATEGY: Coordinates
    let usedCoords = false;
    if (Array.isArray(boardTiles) && boardTiles.length > 0) {
      boardTiles.forEach((tile: any) => {
        if (tile.r >= 0 && tile.r <= 10 && tile.c >= 0 && tile.c <= 10 && tile.L) {
          boardState[`${tile.r},${tile.c}`] = tile.L.toUpperCase();
        }
      });
      usedCoords = true;
    }

    // FALLBACK STRATEGY: String Parsing
    if (!usedCoords || Object.keys(boardState).length === 0) {
      console.warn("Coordinate extraction failed or empty. Falling back to String Protocol.");
      if (boardString && boardString.length === 121) {
        for (let i = 0; i < 121; i++) {
          const char = boardString[i];
          if (char !== '.' && /[A-Z]/.test(char)) {
            const row = Math.floor(i / 11);
            const col = i % 11;
            boardState[`${row},${col}`] = char;
          }
        }
      }
    }

    const cleanRack = (rackStr || "").toUpperCase().replace(/[^A-Z?]/g, '').slice(0, 7);
    return { board: boardState, rack: cleanRack };

  } catch (e) {
    console.error("Parse Error", e);
    throw new Error("Failed to parse board data.");
  }
};

export const solveBoardStream = async (
  board: BoardState,
  rack: string,
  mode: GameMode,
  onChunk: (text: string) => void
): Promise<AnalysisResult> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("VITE_GEMINI_API_KEY is not defined");
  
  const ai = new GoogleGenAI({ apiKey });
  const sparseBoard = Object.entries(board).map(([key, val]) => `${key}:${val}`).join(' ');
  const prompt = `Rack: ${rack}\nMode: ${mode}\nBoard: ${sparseBoard || "EMPTY"}`;

  const response = await ai.models.generateContentStream({
    model: "gemini-2.0-flash", 
    contents: prompt,
    config: {
      systemInstruction: LOGIC_SYSTEM_INSTRUCTION,
      temperature: 0.4,
      responseSchema: LOGIC_SCHEMA,
      responseMimeType: "application/json"
    }
  });

  let fullText = "";
  for await (const chunk of response) {
    fullText += chunk.text;
    onChunk(fullText); 
  }

  const jsonStart = fullText.indexOf('{');
  const jsonEnd = fullText.lastIndexOf('}');
  return { ...JSON.parse(fullText.substring(jsonStart, jsonEnd + 1)), detectedBoard: board };
};
