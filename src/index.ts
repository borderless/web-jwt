import { decode, encodeUrl as encode } from "@borderless/base64";

/**
 * Supported JWT algorithms.
 */
export const ALGORITHMS = {
  HS256: { name: "HMAC", hash: { name: "SHA-256" } },
  HS384: { name: "HMAC", hash: { name: "SHA-384" } },
  HS512: { name: "HMAC", hash: { name: "SHA-512" } },
  PS256: { name: "RSA-PSS", hash: { name: "SHA-256" }, saltLength: 32 },
  PS384: { name: "RSA-PSS", hash: { name: "SHA-384" }, saltLength: 48 },
  PS512: { name: "RSA-PSS", hash: { name: "SHA-512" }, saltLength: 64 },
  RS256: { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } },
  RS384: { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-384" } },
  RS512: { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-512" } },
  ES256: { name: "ECDSA", hash: { name: "SHA-256" }, namedCurve: "P-256" },
  ES384: { name: "ECDSA", hash: { name: "SHA-384" }, namedCurve: "P-384" },
  ES512: { name: "ECDSA", hash: { name: "SHA-512" }, namedCurve: "P-521" },
};

/**
 * JWT header object.
 */
export type JwtHeader = {
  alg: string;
  typ?: "JWT";
  kid?: string;
};

/**
 * JWT payload object.
 */
export type JwtPayload = Record<string, unknown>;

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
  header: { alg: "" },
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
      typeof header.alg === "string" &&
      (header.typ === undefined || header.typ === "JWT") &&
      (header.kid === undefined || typeof header.kid === "string") &&
      payload !== null &&
      typeof payload === "object"
    ) {
      const data = encoder.encode(`${parts[0]}.${parts[1]}`);

      return { header, payload, data, signature };
    }
  } catch {}

  return NOOP_JWT;
}

/**
 * Verify the JWT contents by deriving the signature from the content.
 */
export async function verifyJwt(raw: RawJwt, key: CryptoKey) {
  const { alg } = raw.header;

  if (!ALGORITHMS.hasOwnProperty(alg)) return false;
  if (!raw.data.length || !raw.signature.length) return false;

  return crypto.subtle.verify(
    ALGORITHMS[alg as keyof typeof ALGORITHMS],
    key,
    raw.signature,
    raw.data
  );
}

/**
 * Stringify a JWT payload and sign using crypto key.
 */
export async function encodeJwt(
  header: JwtHeader,
  payload: JwtPayload,
  key: CryptoKey
): Promise<string> {
  const { alg } = header;

  if (!ALGORITHMS.hasOwnProperty(alg)) {
    throw new TypeError("Invalid alg in header");
  }

  const rawHeader = encode(encoder.encode(JSON.stringify(header)));
  const rawPayload = encode(encoder.encode(JSON.stringify(payload)));
  const data = encoder.encode(`${rawHeader}.${rawPayload}`);

  const signature = await crypto.subtle.sign(
    ALGORITHMS[alg as keyof typeof ALGORITHMS],
    key,
    data
  );

  return `${rawHeader}.${rawPayload}.${encode(signature)}`;
}
