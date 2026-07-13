import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { flagEmoji, getFlagUrl, countryName } from "@/lib/countries";

type Category = "bullet" | "blitz" | "rapid";

export const Route = createFileRoute("/_authenticated/leaderboard")({
  head: () => ({ meta: [{ title: "Топ лидеров — Шахматы онлайн" }] }),
  component: Leaderboard,
});

interface Row {
  id: string;
  nickname: string;
  country_code: string | null;
  avatar_url: string | null;
  rating_bullet: number;
  rating_blitz: number;
  rating_rapid: number;
}

function Leaderboard() {
  const [tab, setTab] = useState<Category>("blitz");
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    const col = tab === "bullet" ? "rating_bullet" : tab === "blitz" ? "rating_blitz" : "rating_rapid";
    void supabase
      .from("profiles")
      .select("id, nickname, country_code, avatar_url, rating_bullet, rating_blitz, rating_rapid")
      .order(col, { ascending: false })
      .limit(100)
      .then(({ data }) => setRows(((data as unknown) as Row[]) ?? []));
  }, [tab]);

  const ratingOf = (r: Row) =>
    tab === "bullet" ? r.rating_bullet : tab === "blitz" ? r.rating_blitz : r.rating_rapid;

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between p-4 md:p-6">
        <Link to="/home" className="text-xl text-primary">← Назад</Link>
        <h1 className="text-2xl md:text-3xl font-bold">👑 Топ лидеров</h1>
        <div className="w-16" />
      </header>
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex gap-2 p-1 rounded-lg bg-muted/40 mb-6">
          {(["bullet", "blitz", "rapid"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setTab(c)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${tab === c ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              {c === "bullet" ? "Пуля" : c === "blitz" ? "Блиц" : "Рапид"}
            </button>
          ))}
        </div>
        <div className="card-panel divide-y divide-border">
          {rows.map((r, i) => (
            <div key={r.id} className="flex items-center gap-3 p-3">
              <div className="w-8 text-center text-muted-foreground font-mono">{i + 1}</div>
              <div
                className="h-10 w-10 rounded-full bg-muted bg-cover bg-center border border-border grid place-items-center text-sm"
                style={r.avatar_url ? { backgroundImage: `url(${r.avatar_url})` } : undefined}
              >
                {!r.avatar_url && r.nickname[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">@{r.nickname}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block h-3 w-4 rounded-[2px] overflow-hidden">
                    {getFlagUrl(r.country_code) ? (
                      <img src={getFlagUrl(r.country_code)!} alt={r.country_code!} className="h-full w-full object-cover" />
                    ) : (
                      flagEmoji(r.country_code)
                    )}
                  </span>
                  <span>{countryName(r.country_code)}</span>
                </div>
              </div>
              <div className="text-lg font-bold text-primary tabular-nums">{ratingOf(r)}</div>
            </div>
          ))}
          {rows.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">Пока нет игроков</div>
          )}
        </div>
      </div>
    </div>
  );
}
