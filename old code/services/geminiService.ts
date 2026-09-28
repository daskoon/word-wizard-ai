
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, GameMode, BoardState } from "../types";
import { BOARD_SIZE } from "../constants";

// --- COMPACT VISION PROTOCOL ---
// instead of generating complex JSON objects which take time, we ask for a single string.
// 11x11 = 121 characters.
const VISION_SYSTEM_INSTRUCTION = `
Analyze the Words With Friends board (11x11 grid) and the player's rack (7 tiles).

Output a raw JSON object with exactly two keys:
1. "r": A string of the 7 rack tiles (use ? for blanks).
2. "b": A single string of exactly 121 characters representing the board row-by-row (11 rows of 11 chars). Use '.' for empty squares and uppercase letters for tiles.

Example Output:
{"r":"ABCDEFG", "b":"...........S..........T.........................................................................................."}
`;

const VISION_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    r: { type: Type.STRING, description: "7 rack tiles" },
    b: { type: Type.STRING, description: "121 board chars" }
  },
  required: ["r", "b"]
};

// --- LOGIC AGENT CONFIG ---
const LOGIC_SYSTEM_INSTRUCTION = `
You are a Words With Friends Grandmaster.
Find the highest scoring legal move on this 11x11 board.
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
  base64Image: string
): Promise<VisionResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // We use the lighter Flash model for speed, with a very strict schema to force brevity.
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview", 
    contents: {
      parts: [
        { inlineData: { mimeType: "image/jpeg", data: base64Image } },
        { text: "Extract board and rack." }
      ]
    },
    config: {
      systemInstruction: VISION_SYSTEM_INSTRUCTION,
      temperature: 0.0, // Zero temp for deterministic, faster output
      responseSchema: VISION_SCHEMA,
      responseMimeType: "application/json"
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Vision AI");

  try {
    const parsed = JSON.parse(text);
    const boardStr = parsed.b;
    const rackStr = parsed.r;

    const boardState: BoardState = {};
    
    // Client-side parsing of the compact string is instant.
    if (boardStr && boardStr.length === 121) {
      for (let i = 0; i < 121; i++) {
        const char = boardStr[i];
        if (char !== '.' && /[A-Z]/.test(char)) {
          const row = Math.floor(i / 11);
          const col = i % 11;
          boardState[`${row},${col}`] = char;
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const sparseBoard = Object.entries(board).map(([key, val]) => `${key}:${val}`).join(' ');
  const prompt = `Rack: ${rack}\nMode: ${mode}\nBoard: ${sparseBoard || "EMPTY"}`;

  const response = await ai.models.generateContentStream({
    model: "gemini-3-pro-preview",
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
    onChunk(fullText); // Streaming for the logic phase is still fine as it takes longer
  }

  const jsonStart = fullText.indexOf('{');
  const jsonEnd = fullText.lastIndexOf('}');
  return { ...JSON.parse(fullText.substring(jsonStart, jsonEnd + 1)), detectedBoard: board };
};
