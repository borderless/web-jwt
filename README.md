# Web JWT

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Bundle size][bundlephobia-image]][bundlephobia-url]

> Small JWT library using the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API).

## Installation

```sh
npm install @borderless/web-jwt --save
```

## Usage

```js
import { encodeJwt, decodeJwt, verifyJwt } from "@borderless/web-jwt";

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

## TypeScript

This project is written using [TypeScript](https://github.com/Microsoft/TypeScript) and publishes the definitions directly to NPM.

## License

MIT

[npm-image]: https://img.shields.io/npm/v/@borderless/web-jwt.svg?style=flat
[npm-url]: https://npmjs.org/package/@borderless/web-jwt
[downloads-image]: https://img.shields.io/npm/dm/@borderless/web-jwt.svg?style=flat
[downloads-url]: https://npmjs.org/package/@borderless/web-jwt
[travis-image]: https://img.shields.io/travis/BorderlessLabs/web-jwt.svg?style=flat
[travis-url]: https://travis-ci.org/BorderlessLabs/web-jwt
[coveralls-image]: https://img.shields.io/coveralls/BorderlessLabs/web-jwt.svg?style=flat
[coveralls-url]: https://coveralls.io/r/BorderlessLabs/web-jwt?branch=master
[bundlephobia-image]: https://img.shields.io/bundlephobia/minzip/@borderless/web-jwt.svg
[bundlephobia-url]: https://bundlephobia.com/result?p=@borderless/web-jwt
