// Prices are stored/served as kobo (1 NGN = 100 kobo) — see apps/api's
// Prisma schema comment. This is the one place that turns that back into a
// human-readable Naira string.
export function formatNaira(kobo: number): string {
  const naira = kobo / 100;
  return `₦${naira.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}
