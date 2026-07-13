import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_authenticated/tournaments")({
  head: () => ({ meta: [{ title: "Турниры — Шахматы онлайн" }] }),
  component: TournamentsPage,
});

interface Tournament {
  id: string;
  name: string;
  duration_minutes: number;
  status: "open" | "running" | "finished";
  started_at: string | null;
  ends_at: string | null;
  created_at: string;
  creator_id: string;
}

function TournamentsPage() {
  const { user } = useAuth();
  const [list, setList] = useState<Tournament[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState(30);

  const load = async () => {
    const { data } = await supabase
      .from("tournaments")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setList(((data as unknown) as Tournament[]) ?? []);
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async () => {
    if (!user || !name.trim()) return;
    const ends_at = new Date(Date.now() + duration * 60_000).toISOString();
    await supabase.from("tournaments").insert({
      creator_id: user.id,
      name: name.trim(),
      duration_minutes: duration,
      status: "open",
      started_at: new Date().toISOString(),
      ends_at,
    });
    setShowCreate(false);
    setName("");
    void load();
  };

  const join = async (t: Tournament) => {
    if (!user) return;
    await supabase.from("tournament_participants").insert({
      tournament_id: t.id,
      user_id: user.id,
    });
    alert(`Вы записались в «${t.name}». Матчмейкинг будет свободных участников подбирать автоматически.`);
  };

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between p-4 md:p-6">
        <Link to="/home" className="text-xl text-primary">← Назад</Link>
        <h1 className="text-2xl md:text-3xl font-bold">🏆 Турниры</h1>
        <button className="btn-primary text-sm" onClick={() => setShowCreate(true)}>+ Создать</button>
      </header>

      <div className="max-w-3xl mx-auto px-4 pb-16 space-y-3">
        {list.length === 0 && (
          <div className="card-panel p-10 text-center text-muted-foreground">
            Пока нет турниров. Создайте первый!
          </div>
        )}
        {list.map((t) => {
          const endsIn = t.ends_at ? formatDistanceToNow(new Date(t.ends_at), { addSuffix: true }) : "—";
          return (
            <div key={t.id} className="card-panel p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-lg font-medium">{t.name}</div>
                <div className="text-xs text-muted-foreground">
                  {t.duration_minutes} мин · заканчивается {endsIn}
                </div>
              </div>
              <div className={`text-xs px-2 py-1 rounded-full border ${t.status === "open" ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>
                {t.status === "open" ? "Открыт" : t.status === "running" ? "Идёт" : "Завершён"}
              </div>
              {t.status === "open" && (
                <button className="btn-ghost text-sm" onClick={() => join(t)}>Участвовать</button>
              )}
            </div>
          );
        })}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowCreate(false)}>
          <div className="card-panel w-full max-w-md p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-semibold">Новый турнир</h2>
            <div className="space-y-1.5">
              <label className="text-xs uppercase text-muted-foreground">Название</label>
              <input className="input-base" value={name} onChange={(e) => setName(e.target.value)} placeholder="Кубок среды" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs uppercase text-muted-foreground">Длительность, мин</label>
              <input type="number" className="input-base" value={duration} min={5} max={480} onChange={(e) => setDuration(+e.target.value)} />
            </div>
            <div className="flex gap-2">
              <button className="btn-ghost flex-1" onClick={() => setShowCreate(false)}>Отмена</button>
              <button className="btn-primary flex-1" onClick={create}>Создать</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
