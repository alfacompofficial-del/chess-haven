import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const Input = z.object({
  category: z.enum(["bullet", "blitz", "rapid"]),
  result: z.enum(["win", "loss", "draw"]),
});

const DELTA = { win: 20, loss: -10, draw: 0 } as const;

export const applyRatingChange = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => Input.parse(v))
  .handler(async ({ data, context }) => {
    const field =
      data.category === "bullet"
        ? "rating_bullet"
        : data.category === "blitz"
          ? "rating_blitz"
          : "rating_rapid";
    const { data: profile } = await context.supabase
      .from("profiles")
      .select(field)
      .eq("id", context.userId)
      .maybeSingle();
    const current = (profile as Record<string, number> | null)?.[field] ?? 200;
    const next = Math.max(0, current + DELTA[data.result]);
    const update: Record<string, number> = { [field]: next };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await context.supabase.from("profiles").update(update as any).eq("id", context.userId);
    return { rating: next, delta: DELTA[data.result] };
  });
