import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { flagEmoji, countryName } from "@/lib/countries";

interface Notif {
  id: string;
  type: string;
  payload: { from_nickname?: string; from_country?: string | null; friendship_id?: string } & Record<string, unknown>;
  read: boolean;
  created_at: string;
}

export function NotificationsPanel({ userId, onClose }: { userId: string; onClose: () => void }) {
  const [items, setItems] = useState<Notif[]>([]);

  useEffect(() => {
    void supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30)
      .then(({ data }) => setItems(((data as unknown) as Notif[]) ?? []));
  }, [userId]);

  const respond = async (n: Notif, accept: boolean) => {
    if (n.type === "friend_request" && n.payload.friendship_id) {
      await supabase
        .from("friendships")
        .update({ status: accept ? "accepted" : "declined" })
        .eq("id", n.payload.friendship_id);
    }
    await supabase.from("notifications").delete().eq("id", n.id);
    setItems((prev) => prev.filter((x) => x.id !== n.id));
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 card-panel p-3 z-40 max-h-[70vh] overflow-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium">Уведомления</div>
        <button className="text-muted-foreground text-xs" onClick={onClose}>
          ✕
        </button>
      </div>
      {items.length === 0 && (
        <div className="text-sm text-muted-foreground py-6 text-center">Пусто</div>
      )}
      <div className="space-y-2">
        {items.map((n) => (
          <div key={n.id} className="rounded-lg bg-muted/40 border border-border p-3 text-sm">
            {n.type === "friend_request" ? (
              <>
                <div>
                  <span className="text-lg mr-1">{flagEmoji(n.payload.from_country)}</span>
                  <span className="font-medium">@{n.payload.from_nickname}</span>{" "}
                  <span className="text-muted-foreground">
                    ({countryName(n.payload.from_country)}) — запрос в друзья
                  </span>
                </div>
                <div className="flex gap-2 mt-2">
                  <button className="btn-primary flex-1 py-1.5 text-xs" onClick={() => respond(n, true)}>
                    Принять
                  </button>
                  <button className="btn-ghost flex-1 py-1.5 text-xs" onClick={() => respond(n, false)}>
                    Отклонить
                  </button>
                </div>
              </>
            ) : (
              <div>{n.type}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
