/** Extract the route code from a Beta7 or other HTTP(S) route URL. */
export function routeIdentifier(raw: string): string | null {
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    const segment = url.pathname.replace(/\/+$/, '').split('/').filter(Boolean).at(-1);
    return segment || null;
  } catch {
    return null;
  }
}
