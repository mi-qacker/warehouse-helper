export function getUUID(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}
