import { decode, encodeUrl as encode } from "@borderless/base64";

/**
 * JWT header object.
 */
export type JwtHeader = {
  typ?: "JWT";
  alg?: string;
  kid?: string;
};

/**
 * JWT payload object.
 */
export type JwtPayload = object;

/**
 * JWT none algorithm support.
 */
export const NONE_KEY = Symbol("none");

/**
 * Support `none` JWT key.
 */
export type Key = CryptoKey | typeof NONE_KEY;

/**
 * Raw JWT used for signing.
 */
export type RawJwt = {
  header: JwtHeader;
  payload: JwtPayload;
  data: Uint8Array;
  signature: Uint8Array;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * Decode results for invalid JWTs.
 */
export const NOOP_JWT: RawJwt = {
  header: {},
  payload: {},
  data: new Uint8Array(0),
  signature: new Uint8Array(0),
};

/**
 * Decode the JWT using base64url and JSON.
 */
export function decodeJwt(token: string): RawJwt {
  try {
    const parts = token.split(".", 4);
    if (parts.length !== 3) return NOOP_JWT;

    const header = JSON.parse(decoder.decode(decode(parts[0])));
    const payload = JSON.parse(decoder.decode(decode(parts[1])));
    const signature = decode(parts[2]);

    // Sanity check JWT shape.
    if (
      header !== null &&
      typeof header === "object" &&
      (header.typ === undefined || header.typ === "JWT") &&
      (header.alg === undefined || typeof header.alg === "string") &&
      (header.kid === undefined || typeof header.kid === "string") &&
      payload !== null &&
      typeof payload === "object"
    ) {
      const data = encoder.encode(`${parts[0]}.${parts[1]}`);

      return { header, payload, data, signature };
    }
  } catch {
    // Noop.
  }

  return NOOP_JWT;
}

/**
 * Verify the JWT contents by deriving the signature from the content.
 */
export async function verifyJwt(raw: RawJwt, key: Key) {
  if (key === NONE_KEY) return raw.signature.length === 0; // Support alg none.
  return crypto.subtle.verify(key.algorithm, key, raw.signature, raw.data);
}

/**
 * Stringify a JWT payload and sign using crypto key.
 */
export async function encodeJwt(
  header: JwtHeader,
  payload: JwtPayload,
  key: Key
): Promise<string> {
  const rawHeader = encode(encoder.encode(JSON.stringify(header)));
  const rawPayload = encode(encoder.encode(JSON.stringify(payload)));
  if (key === NONE_KEY) return `${rawHeader}.${rawPayload}.`; // Support alg none.

  const data = encoder.encode(`${rawHeader}.${rawPayload}`);
  const signature = await crypto.subtle.sign(key.algorithm, key, data);
  return `${rawHeader}.${rawPayload}.${encode(signature)}`;
}
