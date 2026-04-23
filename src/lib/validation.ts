export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function trimString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function clampNumber(value: unknown, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const number = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(number)) return min;
  return Math.min(max, Math.max(min, number));
}
