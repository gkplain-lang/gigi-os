/**
 * Deterministic UUID v4-shaped id from a local string id + user scope.
 * Keeps upserts stable across manual sync runs without storing a mapping table.
 */
export function stableRowId(
  localId: string,
  userId: string,
  entity: "project" | "mission" | "history"
): string {
  const seed = `${entity}:${userId}:${localId}`;
  const bytes = new Uint8Array(16);

  for (let i = 0; i < 16; i++) {
    let h = 2166136261 ^ i;
    const chunk = `${seed}:${i}`;
    for (let j = 0; j < chunk.length; j++) {
      h = Math.imul(h ^ chunk.charCodeAt(j), 16777619);
    }
    bytes[i] = h >>> 0 & 0xff;
  }

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
