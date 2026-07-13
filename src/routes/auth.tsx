import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { detectCountry } from "@/lib/geo.functions";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Шахматы онлайн — вход и регистрация" },
      { name: "description", content: "Играйте в шахматы онлайн: блиц, пуля, рапид, турниры и игра с ИИ." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const detect = useServerFn(detectCountry);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/home" });
    });
  }, [navigate]);

  const emailFromNick = (n: string) =>
    `${n.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_")}@chess.local`;

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (nickname.trim().length < 3) return setError("Ник должен быть не короче 3 символов");
    if (password.length < 6) return setError("Пароль не короче 6 символов");
    setBusy(true);
    try {
      const email = emailFromNick(nickname);
      if (mode === "register") {
        const { error: sErr } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { nickname: nickname.trim() } },
        });
        if (sErr) throw sErr;
        // Auto sign-in (email confirm off by default in Cloud)
        const { error: iErr } = await supabase.auth.signInWithPassword({ email, password });
        if (iErr) throw iErr;
        // Detect country and save
        try {
          const geo = await detect();
          const { data: session } = await supabase.auth.getSession();
          if (geo.code && session.session)
            await supabase
              .from("profiles")
              .update({ country_code: geo.code })
              .eq("id", session.session.user.id);
        } catch {
          /* ignore */
        }
      } else {
        const { error: iErr } = await supabase.auth.signInWithPassword({ email, password });
        if (iErr) throw iErr;
      }
      navigate({ to: "/home" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("Invalid login")) setError("Неверный ник или пароль");
      else if (msg.includes("already registered") || msg.includes("User already")) setError("Такой ник уже занят");
      else setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center mb-8">
          <h1 className="text-5xl font-bold text-primary">♞ Шахматы онлайн</h1>
          <p className="mt-2 text-muted-foreground text-sm">Играйте, соревнуйтесь, побеждайте</p>
        </Link>
        <form onSubmit={handle} className="card-panel p-8 space-y-5">
          <div className="flex gap-2 p-1 rounded-lg bg-muted/40">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${mode === "login" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              Вход
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${mode === "register" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              Регистрация
            </button>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Ник</label>
            <input
              className="input-base"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              autoComplete="username"
              placeholder="ваш_ник"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Пароль</label>
            <input
              type="password"
              className="input-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              placeholder="••••••••"
              required
            />
          </div>
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy ? "…" : mode === "login" ? "Войти" : "Создать аккаунт"}
          </button>
          {mode === "register" && (
            <p className="text-xs text-muted-foreground text-center">
              Ник закрепится за вашим аккаунтом навсегда. Отображаемое имя можно будет менять в профиле.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
