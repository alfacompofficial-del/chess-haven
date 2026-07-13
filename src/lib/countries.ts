// Country code (ISO 3166-1 alpha-2) -> name + emoji flag
export const COUNTRY_NAMES: Record<string, { ru: string; en: string }> = {
  RU: { ru: "Россия", en: "Russia" },
  US: { ru: "США", en: "United States" },
  GB: { ru: "Великобритания", en: "United Kingdom" },
  DE: { ru: "Германия", en: "Germany" },
  FR: { ru: "Франция", en: "France" },
  UA: { ru: "Украина", en: "Ukraine" },
  BY: { ru: "Беларусь", en: "Belarus" },
  KZ: { ru: "Казахстан", en: "Kazakhstan" },
  UZ: { ru: "Узбекистан", en: "Uzbekistan" },
  KG: { ru: "Кыргызстан", en: "Kyrgyzstan" },
  AM: { ru: "Армения", en: "Armenia" },
  AZ: { ru: "Азербайджан", en: "Azerbaijan" },
  GE: { ru: "Грузия", en: "Georgia" },
  PL: { ru: "Польша", en: "Poland" },
  IN: { ru: "Индия", en: "India" },
  CN: { ru: "Китай", en: "China" },
  JP: { ru: "Япония", en: "Japan" },
  KR: { ru: "Корея", en: "Korea" },
  BR: { ru: "Бразилия", en: "Brazil" },
  ES: { ru: "Испания", en: "Spain" },
  IT: { ru: "Италия", en: "Italy" },
  NL: { ru: "Нидерланды", en: "Netherlands" },
  TR: { ru: "Турция", en: "Turkey" },
  CA: { ru: "Канада", en: "Canada" },
  AU: { ru: "Австралия", en: "Australia" },
  MX: { ru: "Мексика", en: "Mexico" },
  AR: { ru: "Аргентина", en: "Argentina" },
  SE: { ru: "Швеция", en: "Sweden" },
  NO: { ru: "Норвегия", en: "Norway" },
  FI: { ru: "Финляндия", en: "Finland" },
  IE: { ru: "Ирландия", en: "Ireland" },
  PT: { ru: "Португалия", en: "Portugal" },
  CH: { ru: "Швейцария", en: "Switzerland" },
  AT: { ru: "Австрия", en: "Austria" },
  CZ: { ru: "Чехия", en: "Czechia" },
  RO: { ru: "Румыния", en: "Romania" },
  BG: { ru: "Болгария", en: "Bulgaria" },
  GR: { ru: "Греция", en: "Greece" },
  IL: { ru: "Израиль", en: "Israel" },
  AE: { ru: "ОАЭ", en: "UAE" },
  SA: { ru: "Саудовская Аравия", en: "Saudi Arabia" },
  EG: { ru: "Египет", en: "Egypt" },
  ZA: { ru: "ЮАР", en: "South Africa" },
  ID: { ru: "Индонезия", en: "Indonesia" },
  VN: { ru: "Вьетнам", en: "Vietnam" },
  TH: { ru: "Таиланд", en: "Thailand" },
  PH: { ru: "Филиппины", en: "Philippines" },
  MY: { ru: "Малайзия", en: "Malaysia" },
  SG: { ru: "Сингапур", en: "Singapore" },
};

export function flagEmoji(countryCode?: string | null): string {
  if (!countryCode || countryCode.length !== 2) return "🏳️";
  const base = 0x1f1e6;
  const cc = countryCode.toUpperCase();
  return String.fromCodePoint(base + cc.charCodeAt(0) - 65, base + cc.charCodeAt(1) - 65);
}

export function getFlagUrl(countryCode?: string | null): string | null {
  if (!countryCode || countryCode.length !== 2) return null;
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
}

export function countryName(code: string | null | undefined, lang: "ru" | "en" = "ru"): string {
  if (!code) return lang === "ru" ? "Неизвестно" : "Unknown";
  const entry = COUNTRY_NAMES[code.toUpperCase()];
  if (!entry) return code.toUpperCase();
  return entry[lang];
}
