import { webcrypto } from "node:crypto";
import { describe, it, expect } from "vitest";
import {
  encodeJwt,
  verifyJwt,
  decodeJwt,
  NOOP_JWT,
  NONE_KEY,
} from "./index.js";

// @ts-expect-error next-line
globalThis.crypto = webcrypto; // Node.js 18 support.

describe("web jwt", () => {
  describe("validation", () => {
    it("should detect invalid jwt format", () => {
      expect(decodeJwt("a")).toEqual(NOOP_JWT);
      expect(decodeJwt("a.a")).toEqual(NOOP_JWT);
      expect(decodeJwt("a.a.a")).toEqual(NOOP_JWT);
      expect(decodeJwt("a.a.a.a")).toEqual(NOOP_JWT);
    });
  });

  const jwtNone = "eyJhbGciOiJub25lIn0.eyJ0ZXN0Ijp0cnVlfQ.";
  const jwtHmac =
    "eyJhbGciOiJIUzI1NiJ9.eyJ0ZXN0Ijp0cnVlfQ.pQM0RvgTKjtAC1XmMnCK4vhgGycbg0vVLn0rsiE8BGc";
  const jwtRsa =
    "eyJhbGciOiJSUzI1NiJ9.eyJ0ZXN0Ijp0cnVlfQ.SSjalLyh2Ny9c1On_0BTavzmD3k1a7jTyceDhWiP2QpuGmRql3WxEB6ArSfqAZVlrTNr7ZjPPld0hmha-LyaBqxYRfjCUK1yphjmhTJoIWgPyim7phS5Il0vPNPM6jy2bEIyfpjftXpHfI64HH4_DQMiScpm5MxH-Miy2APuBw6OoR5fA9gpLNkgdhmLePr02jD2J3XvLwWgDEz-bwCi_Ri8YJrjWxvoy8NNHZx39VS8cPAj1CYJbGN4k3ZqFEHQ88YPWGGsN1XW2JYAoZzU4QHzGtbKte0FdOfIlsbEGi_aC7w-pPe7x1dk-K9k1nkyXBiY3lQNVxQiOVFAyLYEKg";

  const hmacKey = () =>
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

  const rsaPrivateKey = () =>
    crypto.subtle.importKey(
      "jwk",
      {
        p: "-rUXss3o2XzbtabYG7eNaJ8n4mKoqEMcMJ7VdFAc1GoDYmoRSKDfBqnFh5eLcgNlSgwNftsUB3Zk4vYzGcsUnZ0NipnNV2IFRctiUAEGXw-g_1lVGGpE98eXU_jdvP78VQ4NO3BDhaqDRS6ynB2L8A0nBgsibNPsVwnCd7A2cX8",
        kty: "RSA",
        q: "nLaJ0hAk3PMKJ9d7jTwN6tjvnNUGa4_EoVKEfhUP7CbJEedD5vt2xhyuQtwNI6wnbb0OwHl6ZUwMQ_P4bRMYrRvisd7hBjcBHZlE7H3wM2OeMyGFs19VJebG3Sm2N11WgL-VaiIWJxrtztP26nWxAmrP3aiIZKGhz75HBTeacGM",
        d: "CQtAIbXxkZK9B6EfPbtqIuREK7tdR-vesEZ156wplhiouz5u_NpVnHgsu1ejRv2HXT_lQ_1LaPP7BwRLLPSkIcy7s6T9Zy-2CxeIklcmawIuhgNNbbLPznwTDw3gYbz0H6jyyCxDK7moTTfe1uZEpsOKNhUoAeBMu66P4cX5CV2TVxoTdOEcrG7hYNNMjB9ZuFnsxwBy9a9aRQKFR-HMeIRMAUu5132izoFs7IhpLpVMi_1AgT7KRRnBhcRN8iWqMD1ymIo2j-P9D8ix49h-ioaJHZs4ifzaf2k6scA1TUWMpm4XSYhw27zvkoVctMUVOk6g47mL9fhEfnGY49EVKQ",
        e: "AQAB",
        use: "sig",
        qi: "ZrZLmchge3e9sAV4MdkgmpovtvS9uASdKDYKxBQUkiGcQa_NF7BG68zDdJVPrsSjoxV8iytE8yW9jZiMnljwI74I7pMxwi2duLNCBcF3Koj2Jx4BoLPOCot0r0HMP3LLLvr-Bjlku7e9-XXOt6WHS0Xbade0qPGE4tkYREN5t4s",
        dp: "lsl-hGt2BgEjwCCmUB1Y7rjy6yU9nV4nwVJ2vatFe7h7aqCy3oTrPv2zMXdDRoKmVB_lqguoA0kBKsS7PWM4dge00kzpBQqOc0j9S3MiWuByi8I1_SZFbuXbrYS8EOUn7RwzdzFxWx6QL3cDtAPNW8b9VpQx01SvDDZxgT05sY8",
        alg: "RS256",
        dq: "fjLhObCWfveZLgxxCoNaEc0w6HMEAIp-Jgt1drMvZ1S0hx5dqBzIwTFHg8ABNMDl35Fn18f7sKdVGUPWwr-mF4FlRSfevkp9M4DB6FBipn-KXlKYgKI8x5DYhDGa82rOxk-B2z4n6MXey7gWFyk_qlqpmi6l56Ph0pHAT4s_a1E",
        n: "mXkeKHCj1EVgReBfYI6kA5suiIUr1acVWp_DbC9Hm2SLufIYWKWdjQtZMK3YZu5CNLceWg4DVKycGwADQ7up_SQG6ztUdhCFSjaZHUfFz4SK80LpqVAKsRxXLQEn4RD11R39sCCR1JIZHU9qYA6NqD-zNvnoVnVeQj18Pm7At-04zsHnbtyhddWLzvn_ndMhEkBnjFjm495MVRlnFjt9xPN3NROjKcG8FI28yy7njLbzh3kU8IyJY2Nn2CDm4ZkYvFx4yqpUMR-j8QhkK91on9zvrA_Vz4cOt8M4W-jfHUZeOGgHyLABoV40_DpgqvRt2rjsm5FX22MYgrT-hht0HQ",
      },
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"]
    );

  const rsaPublicKey = () =>
    crypto.subtle.importKey(
      "jwk",
      {
        kty: "RSA",
        e: "AQAB",
        use: "sig",
        alg: "RS256",
        n: "mXkeKHCj1EVgReBfYI6kA5suiIUr1acVWp_DbC9Hm2SLufIYWKWdjQtZMK3YZu5CNLceWg4DVKycGwADQ7up_SQG6ztUdhCFSjaZHUfFz4SK80LpqVAKsRxXLQEn4RD11R39sCCR1JIZHU9qYA6NqD-zNvnoVnVeQj18Pm7At-04zsHnbtyhddWLzvn_ndMhEkBnjFjm495MVRlnFjt9xPN3NROjKcG8FI28yy7njLbzh3kU8IyJY2Nn2CDm4ZkYvFx4yqpUMR-j8QhkK91on9zvrA_Vz4cOt8M4W-jfHUZeOGgHyLABoV40_DpgqvRt2rjsm5FX22MYgrT-hht0HQ",
      },
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"]
    );

  describe("none", () => {
    it("should encode", async () => {
      expect(
        await encodeJwt(
          {
            alg: "none",
          },
          {
            test: true,
          },
          NONE_KEY
        )
      ).toEqual(jwtNone);
    });

    it("should decode and verify", async () => {
      const decoded = await decodeJwt(jwtNone);
      expect(decoded.header).toEqual({ alg: "none" });
      expect(decoded.payload).toEqual({ test: true });

      const valid = await verifyJwt(decoded, NONE_KEY);
      expect(valid).toBe(true);
    });

    it("should not verify with hmac key", async () => {
      const decoded = await decodeJwt(jwtNone);
      const valid = await verifyJwt(decoded, await hmacKey());
      expect(valid).toBe(false);
    });
  });

  describe("hmac", () => {
    it("should encode jwt", async () => {
      expect(
        await encodeJwt(
          {
            alg: "HS256",
          },
          {
            test: true,
          },
          await hmacKey()
        )
      ).toEqual(jwtHmac);
    });

    it("should decode and verify", async () => {
      const decoded = await decodeJwt(jwtHmac);
      expect(decoded.header).toEqual({ alg: "HS256" });
      expect(decoded.payload).toEqual({ test: true });

      const valid = await verifyJwt(decoded, await hmacKey());
      expect(valid).toBe(true);
    });

    it("should not verify with none key", async () => {
      const decoded = await decodeJwt(jwtHmac);
      const valid = await verifyJwt(decoded, NONE_KEY);
      expect(valid).toBe(false);
    });

    it("should not verify with empty signature", async () => {
      const decoded = await decodeJwt(jwtNone);
      const valid = await verifyJwt(decoded, await hmacKey());
      expect(valid).toBe(false);
    });
  });

  describe("rsa", () => {
    it("should encode jwt", async () => {
      expect(
        await encodeJwt(
          {
            alg: "RS256",
          },
          {
            test: true,
          },
          await rsaPrivateKey()
        )
      ).toEqual(jwtRsa);
    });

    it("should decode and verify", async () => {
      const decoded = await decodeJwt(jwtRsa);
      expect(decoded.header).toEqual({ alg: "RS256" });
      expect(decoded.payload).toEqual({ test: true });

      const valid = await verifyJwt(decoded, await rsaPublicKey());
      expect(valid).toBe(true);
    });

    it("should not verify with none key", async () => {
      const decoded = await decodeJwt(jwtRsa);
      const valid = await verifyJwt(decoded, NONE_KEY);
      expect(valid).toBe(false);
    });
  });
});
