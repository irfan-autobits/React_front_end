// src/utils/time.js
export function parseTimestamp(ts) {
  // Accept ISO Z strings or epoch ms numbers
  return typeof ts === "number" ? new Date(ts) : new Date(ts);
}

export function formatTimestamp(date, opts) {
  return date.toLocaleString(undefined, opts);
}

export function formatShort(date) {
  return date.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

/**
 * Convert a 'YYYY-MM-DDThh:mm' local‐only string into a full UTC ISO string.
 * e.g. '2025-05-01T14:30' → '2025-05-01T14:30:00.000Z'
 */
export function localToUtcIso(localStr) {
  // new Date(localStr) treats it as local time, then toISOString() gives UTC Z
  return new Date(localStr).toISOString();
}

