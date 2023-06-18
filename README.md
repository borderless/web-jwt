# Web JWT

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][build-image]][build-url]
[![Test coverage][coverage-image]][coverage-url]
[![Bundle size][bundle-image]][bundle-url]

> Small JWT library using the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API).

## Installation

```sh
npm install @borderless/web-jwt --save
```

## Usage

```js
import {
  encodeJwt,
  decodeJwt,
  verifyJwt,
  NOOP_JWT,
  NONE_KEY,
} from "@borderless/web-jwt";

// Create a web crypto key.
const key = crypto.subtle.importKey(
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

// Create a JWT and sign using the key.
await encodeJwt(
  {
    alg: "HS256",
  },
  {
    test: true,
  },
  key
); //=> "eyJhbGciOiJIUzI1NiJ9.eyJ0ZXN0Ijp0cnVlfQ.pQM0RvgTKjtAC1XmMnCK4vhgGycbg0vVLn0rsiE8BGc"

// Decode the JWT.
const jwt = await decodeJwt(
  "eyJhbGciOiJIUzI1NiJ9.eyJ0ZXN0Ijp0cnVlfQ.pQM0RvgTKjtAC1XmMnCK4vhgGycbg0vVLn0rsiE8BGc"
); //=> { header, payload, ... }

// Verify the decoded JWT _before_ trusting!
const valid = await verifyJwt(jwt); //=> true
```

**Notes:**

- `decodeJwt` will return a `NOOP_JWT` when decoding an invalid JWT. No errors are thrown on invalid data.
- `alg: none` is only supported by using the `NONE_KEY` symbol exported by the package.
- The JWT `alg` header is ignored and the crypto key algorithm is used instead. This avoids attacks using the `alg` header.

## TypeScript

This project is written using [TypeScript](https://github.com/Microsoft/TypeScript) and publishes the definitions directly to NPM.

## License

MIT

[npm-image]: https://img.shields.io/npm/v/@borderless/web-jwt
[npm-url]: https://npmjs.org/package/@borderless/web-jwt
[downloads-image]: https://img.shields.io/npm/dm/@borderless/web-jwt
[downloads-url]: https://npmjs.org/package/@borderless/web-jwt
[build-image]: https://img.shields.io/github/actions/workflow/status/borderless/web-jwt/ci.yml?branch=main
[build-url]: https://github.com/borderless/web-jwt/actions/workflows/ci.yml?query=branch%3Amain
[coverage-image]: https://img.shields.io/codecov/c/gh/borderless/web-jwt
[coverage-url]: https://codecov.io/gh/borderless/web-jwt
[bundle-image]: https://img.shields.io/bundlephobia/minzip/@borderless/web-jwt.svg
[bundle-url]: https://bundlephobia.com/result?p=@borderless/web-jwt
