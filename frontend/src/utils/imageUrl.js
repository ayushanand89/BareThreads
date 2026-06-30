/**
 * Request a higher-resolution variant of a product image.
 *
 * The seeded product images come from Zalando's CDN (ztat.net), which serves a
 * low-resolution default when no width is specified — that's why large/zoomed
 * images look grainy. Appending `imwidth` asks the CDN for a crisp HD version.
 *
 * Safe no-op for any non-ztat URL.
 */
export const hiRes = (url, width = 1200) => {
  if (!url || typeof url !== "string") return url;
  if (url.includes("ztat.net")) {
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}imwidth=${width}`;
  }
  return url;
};
