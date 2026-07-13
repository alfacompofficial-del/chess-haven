import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

/**
 * Detect the caller's ISO country code from their IP via ipapi.co.
 * Returns null on any failure — the caller falls back gracefully.
 */
export const detectCountry = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const req = getRequest();
    const forwarded = req?.headers.get("x-forwarded-for") ?? "";
    const ip = forwarded.split(",")[0]?.trim() || req?.headers.get("cf-connecting-ip") || "";
    const url = ip ? `https://ipapi.co/${encodeURIComponent(ip)}/country/` : "https://ipapi.co/country/";
    const res = await fetch(url, { headers: { "User-Agent": "chess-online/1.0" } });
    if (!res.ok) return { code: null as string | null };
    const text = (await res.text()).trim().toUpperCase();
    if (/^[A-Z]{2}$/.test(text)) return { code: text };
    return { code: null };
  } catch {
    return { code: null };
  }
});
