/** Additive XOR secret-sharing over UTF-8 bytes. One share is uniform noise. */

export function encodePrompt(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

export function decodePrompt(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

export function splitBytes(plain: Uint8Array): { s0: Uint8Array; s1: Uint8Array } {
  const s0 = new Uint8Array(plain.length);
  crypto.getRandomValues(s0);
  const s1 = new Uint8Array(plain.length);
  for (let i = 0; i < plain.length; i++) s1[i] = plain[i] ^ s0[i];
  return { s0, s1 };
}

export function combineBytes(s0: Uint8Array, s1: Uint8Array): Uint8Array {
  const out = new Uint8Array(s0.length);
  for (let i = 0; i < s0.length; i++) out[i] = s0[i] ^ s1[i];
  return out;
}

export function asLatin1(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => String.fromCharCode(b)).join("");
}

export function asHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function hexPreview(bytes: Uint8Array, max = 48): string {
  const hex = asHex(bytes);
  return hex.length <= max ? hex : `${hex.slice(0, max)}…`;
}
