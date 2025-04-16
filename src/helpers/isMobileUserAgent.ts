export function isMobileUserAgent(userAgent: string | null): boolean {
  return !!userAgent?.match(/Android|iPhone|iPad|iPod|Mobile/i);
}
