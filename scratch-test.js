import { getAiMove } from "./src/lib/chess-ai.functions.ts";

async function main() {
  const result = await getAiMove({ data: { fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", difficulty: "hard" } });
  console.log(result);
}

main();
