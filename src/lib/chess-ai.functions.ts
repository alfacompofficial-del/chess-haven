import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { Chess } from "chess.js";
import { createLovableAi } from "./ai-gateway.server";

const Input = z.object({
  fen: z.string().min(10),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
});

/**
 * Ask Gemini 2.5 Flash for the next move given a FEN.
 * We validate the response against chess.js legal moves; on invalid output
 * or model failure we fall back to a random legal move so the AI never
 * breaks the rules.
 */
export const getAiMove = createServerFn({ method: "POST" })
  .inputValidator((v: unknown) => Input.parse(v))
  .handler(async ({ data }) => {
    const chess = new Chess(data.fen);
    const legal = chess.moves({ verbose: true });
    if (legal.length === 0) return { move: null, from: null, to: null, promotion: null };

    const legalUci = legal.map(
      (m) => `${m.from}${m.to}${m.promotion ?? ""}`,
    );

    const boardAscii = chess.ascii();
    const turn = chess.turn() === "w" ? "White" : "Black";

    const strengthHint =
      data.difficulty === "easy"
        ? "You are a beginner. Play reasonable but not perfect moves."
        : data.difficulty === "hard"
          ? "You are a strong master. Calculate deeply and play the best move to win."
          : "You are an intermediate player. Play solid moves and try to win.";

    const prompt = `You are playing chess. Your goal is to WIN.
${strengthHint}

Current position (FEN): ${data.fen}
It is ${turn} to move (that is you).

Board (uppercase = White, lowercase = Black):
${boardAscii}

Legal moves in UCI notation: ${legalUci.join(", ")}

Respond with EXACTLY ONE legal move from the list above, in UCI format (e.g. "e2e4" or "e7e8q" for promotion). No commentary, no punctuation, no analysis — just the 4-5 character move.`;

    let chosen: string | null = null;
    try {
      const provider = createLovableAi();
      const result = await generateText({
        model: provider("openai/gpt-4o"),
        prompt,
      });
      const raw = result.text.trim().toLowerCase();
      const match = raw.match(/[a-h][1-8][a-h][1-8][qrbn]?/);
      if (match && legalUci.includes(match[0])) chosen = match[0];
    } catch (e) {
      console.error("AI move error:", e);
    }

    if (!chosen) {
      // Fallback: random legal move so game never stalls.
      chosen = legalUci[Math.floor(Math.random() * legalUci.length)];
    }

    const from = chosen.slice(0, 2);
    const to = chosen.slice(2, 4);
    const promotion = chosen.length === 5 ? chosen[4] : null;
    return { move: chosen, from, to, promotion };
  });
