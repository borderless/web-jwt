import { describe, it, expect } from "vitest";
import { encodeJwt, verifyJwt, decodeJwt, NOOP_JWT } from "./index.js";

describe("web jwt", () => {
  describe("validation", () => {
    it("should detect invalid jwt format", () => {
      expect(decodeJwt("a")).toEqual(NOOP_JWT);
      expect(decodeJwt("a.a")).toEqual(NOOP_JWT);

      expect(decodeJwt("a.a.a.a")).toEqual(NOOP_JWT);
    });
  });

  describe("hmac", () => {
    const jwt =
      "eyJhbGciOiJIUzI1NiJ9.eyJ0ZXN0Ijp0cnVlfQ.pQM0RvgTKjtAC1XmMnCK4vhgGycbg0vVLn0rsiE8BGc";

    const key = () =>
      crypto.subtle.importKey(
        "jwk",
        {
          kty: "oct",
          k: "4Vulge0qgl6janNxYmrYk-sao2wR5tpyKkh_sTLY2CQ",
          alg: "HS256",
        },
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign", "verify"]
      );

    it("should encode jwt", async () => {
      expect(
        await encodeJwt(
          {
            alg: "HS256",
          },
          {
            test: true,
          },
          await key()
        )
      ).toEqual(jwt);
    });

    it("should decode and verify jwt", async () => {
      const decoded = await decodeJwt(jwt);

      expect(decoded.header).toEqual({ alg: "HS256" });
      expect(decoded.payload).toEqual({ test: true });

      const valid = await verifyJwt(decoded, await key());
      expect(valid).toBe(true);
    });
  });
});
