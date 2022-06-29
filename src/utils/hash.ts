async function digest(algo: string, message: string) {
  // encode as (utf-8) Uint8Array
  const msgUint8 = new TextEncoder().encode(message);
  // hash the message
  const hashBuffer = await crypto.subtle.digest(algo, msgUint8);
  // convert buffer to byte array
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  // convert bytes to hex string
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

export function sha1(s: string): Promise<string> {
  return digest("SHA-1", s);
}

export function sha256(s: string): Promise<string> {
  return digest("SHA-256", s);
}
