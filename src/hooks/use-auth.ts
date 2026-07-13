import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  nickname: string;
  display_name: string | null;
  avatar_url: string | null;
  country_code: string | null;
  rating_rapid: number;
  rating_blitz: number;
  rating_bullet: number;
  language: string;
  board_theme: string;
  premoves_enabled: boolean;
  sounds_enabled: boolean;
  show_legal_moves: boolean;
  auto_queen: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (uid: string) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", uid).maybeSingle();
    setProfile((data as Profile) ?? null);
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => loadProfile(session.user.id), 0);
      } else {
        setProfile(null);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      if (data.session?.user) loadProfile(data.session.user.id);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);

  return {
    user,
    profile,
    loading,
    refreshProfile: () => user && loadProfile(user.id),
    signOut: () => supabase.auth.signOut(),
  };
}
