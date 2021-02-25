<h1 align="center">next-secure-headers</h1>

<h4 align="center">⛑️ Sets secure response headers for Next.js. 🌻</h4>

```js
// /next.config.js

module.exports = {
  async headers() {
    return [{
      source: "/(.*)",
      headers: createSecureHeaders({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: "'self'",
            styleSrc: ["'self'", "https://stackpath.bootstrapcdn.com"],
          },
        },
        forceHTTPSRedirect: [true, { maxAge: 60 * 60 * 24 * 4, includeSubDomains: true }],
        referrerPolicy: "same-origin",
      })
    }];
  },
};
```

<div align="center">
<a href="https://www.npmjs.com/package/next-secure-headers"><img src="https://img.shields.io/npm/v/next-secure-headers.svg" alt="npm"></a>
<a href="https://github.com/jagaapple/next-secure-headers/actions?query=workflow%3A%22Build+and+test%22"><img src="https://github.com/jagaapple/next-secure-headers/workflows/Build%20and%20test/badge.svg" alt="GitHub Actions"></a>
<a href="https://codecov.io/gh/jagaapple/next-secure-headers"><img src="https://img.shields.io/codecov/c/github/jagaapple/next-secure-headers.svg"></a>
<a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/github/license/jagaapple/next-secure-headers.svg" alt="license"></a>
<a href="https://twitter.com/jagaapple_tech"><img src="https://img.shields.io/badge/contact-%40jagaapple_tech-blue.svg" alt="@jagaapple_tech"></a>
</div>

## Table of Contents

<!-- TOC depthFrom:2 -->

- [Table of Contents](#table-of-contents)
- [Features](#features)
  - [Why use next-secure-headers instead of Helmet?](#why-use-next-secure-headers-instead-of-helmet)
    - [next-secure-headers vs Helmet](#next-secure-headers-vs-helmet)
- [Quick Start](#quick-start)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Setup](#setup)
    - [Use `createSecureHeaders` in `next.config.js` (RECOMMENDED)](#use-createsecureheaders-in-nextconfigjs-recommended)
    - [Use `withSecureHeaders` in page components](#use-withsecureheaders-in-page-components)
- [Rules](#rules)
  - [`forceHTTPSRedirect`](#forcehttpsredirect)
  - [`frameGuard`](#frameguard)
  - [`noopen`](#noopen)
  - [`nosniff`](#nosniff)
  - [`xssProtection`](#xssprotection)
  - [`contentSecurityPolicy`](#contentsecuritypolicy)
  - [`expectCT`](#expectct)
  - [`referrerPolicy`](#referrerpolicy)
- [API](#api)
  - [`createSecureHeaders`](#createsecureheaders)
  - [`withSecureHeaders`](#withsecureheaders)
  - [`createHeadersObject`](#createheadersobject)
- [Recipes](#recipes)
  - [How to remove X-Powered-By header](#how-to-remove-x-powered-by-header)
  - [Overrides headers in a specific page using `withSecureHeaders`](#overrides-headers-in-a-specific-page-using-withsecureheaders)
- [Contributing to next-secure-headers](#contributing-to-next-secure-headers)
- [License](#license)

<!-- /TOC -->


## Features
| FEATURES                    | WHAT YOU CAN DO                                         |
|-----------------------------|---------------------------------------------------------|
| ⚛️ **Designed for Next.js**  | Use for `next.config.js` or page components in `/pages` |
| ✨ **Default applied rules** | Help your project even if you don't have knowledge      |
| 🎩 **Type Safe**            | You can use with TypeScript                             |

### Why use next-secure-headers instead of Helmet?
next-secure-headers is a similar to [Helmet](https://github.com/helmetjs/helmet), which sets HTTP response headers related to
security for Express.js.

Next.js supports to be used in Node.js frameworks such as Express.js. So you can use Helmet with your Next.js project if you
create a custom server, but the Next.js development team does not recommend a custom server.
Also, they are working to implement in order to be possible to use Next.js without a custom server. In fact, Next.js 9 supports
[Dynamic Routing](https://github.com/zeit/next.js/#dynamic-routing), so we don't need to build a custom server in order to
implement it using such as [next-routes](https://github.com/fridays/next-routes), which requires a custom server.

```js
// /next.config.js
const { createSecureHeaders } = require("next-secure-headers");

module.exports = {
  async headers() {
    return [{ source: "/(.*)", headers: createSecureHeaders() }];
  },
};
```

If you want to use Helmet, it requires to use a custom server against a recommended way. To solve this problem, next-secure-headers
was born. next-secure-headers is built for Next.js project so that you can specify any headers in `next.config.js` or page
components.

#### next-secure-headers vs Helmet
The following are rules next-secure-headers has and Helmet has. next-secure-headers is inspired by Helmet, but it doesn't have
some rules for some reason.

|                                   | next-secure-headers     | Helmet                  | Comment                                                                                           |
|-----------------------------------|-------------------------|-------------------------|---------------------------------------------------------------------------------------------------|
| Strict-Transport-Security         | `forceHTTPSRedirect`    | `hsts`                  |                                                                                                   |
| X-Frame-Options                   | `frameGuard`            | `frameguard`            |                                                                                                   |
| X-Download-Options                | `noopen`                | `ieNoOpen`              |                                                                                                   |
| X-Content-Type-Options            | `nosniff`               | `noSniff`               |                                                                                                   |
| X-XSS-Protection                  | `xssProtection`         | `xssFilter`             |                                                                                                   |
| Content-Security-Policy           | `contentSecurityPolicy` | `contentSecurityPolicy` |                                                                                                   |
| Expect-CT                         | `expectCT`              | `expectCt`              |                                                                                                   |
| Referrer-Policy                   | `referrerPolicy`        | `referrerPolicy`        |                                                                                                   |
| X-DNS-Prefetch-Control            | -                       | `dnsPrefetchControl`    | This has privacy implications but this improves performance.                                      |
| Feature-Policy                    | -                       | `featurePolicy`         | Feature Policy improves security but it is working draft yet.                                     |
| X-Powered-By                      | -                       | `hidePoweredBy`         | [Next.js supports to remove this header in `next.config.js`](#how-to-remove-x-powered-by-header). |
| Related to cache                  | -                       | `nocache`               | As Helmet said, caching has lots of benefits.                                                     |
| X-Permitted-Cross-Domain-Policies | -                       | `crossdomain`           | Adobe Flash is one of old web technologies.                                                       |


## Quick Start
### Requirements
- npm or Yarn
- Node.js 10.0.0 or higher
- Next.js 8.0.0 or higher

### Installation
```bash
$ npm install -D next-secure-headers
```

If you are using Yarn, use the following command.

```bash
$ yarn add -D next-secure-headers
```

> ❗️ **For `withSecureHeaders` .**
> If you want to use `withSecureHeaders` , you have to install without `-D` option (i.e., installing as `dependencies` not
> `devDependencies` ).

### Setup
There are two ways to specify headers.
One is to use `createSecureHeaders` in `next.config.js` , and another is to use `withSecureHeaders` in page components.

#### Use `createSecureHeaders` in `next.config.js` (RECOMMENDED)
> ❗️ **Next.js 9.5 or higher is required.**
> `headers` function has been supported since Next.js 9.5, so you have to use Next.js 9.5 or higher if you want to use this way.

> 🤔 **For Next.js 10 and I18n routes.**
> If your project uses Next.js 10 and built-in I18n routes, and you want to apply rules for all pages, you have to specify
> `"/:path*"` to `source` property instead of `"/(.*)"` .
> Conversely, if your project doesn't use I18n routes even if using Next.js 10, you have to specify `"/(.*)"` instead.
> These limitations are maybe bugs in Next.js .

This way uses `createSecureHeaders` function and [a built-in header configuration way by Next.js](https://nextjs.org/docs/api-reference/next.config.js/headers).
This is not required any servers, can be used in static pages, and can retain [Automatic Static Optimization](https://nextjs.org/docs/advanced-features/automatic-static-optimization).
If your project does not use any servers (using static pages or SSG) or you have just created a Next.js project, I recommend retaining static pages and adopting this way.

Import `createSecureHeaders` from next-secure-headers and use it in `headers` async function in `next.config.js` .

```js
// /next.config.js
const { createSecureHeaders } = require("next-secure-headers");

module.exports = {
  async headers() {
    return [{ source: "/(.*)", headers: createSecureHeaders() }];
  },
};
```

By default, next-secure-headers applies some rules. If you want to enable or disable rules, you can give options to the first
argument of the function.

```js
module.exports = {
  async headers() {
    return [{
      source: "/(.*)",
      headers: createSecureHeaders({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: "'self'",
            styleSrc: ["'self'", "https://stackpath.bootstrapcdn.com"],
          },
        },
        forceHTTPSRedirect: [true, { maxAge: 60 * 60 * 24 * 4, includeSubDomains: true }],
        referrerPolicy: "same-origin",
      }),
    }];
  },
};
```

Also, you can configure different headers by URLs following [the official documents](https://nextjs.org/docs/api-reference/next.config.js/headers).

#### Use `withSecureHeaders` in page components
> ❗️ **Servers are required.**
> This way requires any servers because `withSecureHeaders` uses `getServerSideProps` of Next.js.

Use an exported function for your Next.js application in `/pages/_app.tsx` . Also, you can use in any page components in
`/pages/xxx.tsx` instead.

```ts
// /pages/_app.tsx
import { withSecureHeaders } from "next-secure-headers";

class Application extends App {
  ...
}

export default withSecureHeaders()(Application);
```

By default, next-secure-headers applies some rules. If you want to enable or disable rules, you can give options to the first
argument of the function.

```ts
export default withSecureHeaders({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: "'self'",
      styleSrc: ["'self'", "https://stackpath.bootstrapcdn.com"],
    },
  },
  forceHTTPSRedirect: [true, { maxAge: 60 * 60 * 24 * 4, includeSubDomains: true }],
  referrerPolicy: "same-origin",
})(Application);
```


## Rules
### `forceHTTPSRedirect`
```ts
{
  forceHTTPSRedirect: boolean | [true, Partial<{ maxAge: number; includeSubDomains: boolean; preload: boolean }>];
}
```

| Default Value                  | MDN                                                                           |
|--------------------------------|-------------------------------------------------------------------------------|
| `[true, { maxAge: 63072000 }]` | https://developer.mozilla.org/docs/Web/HTTP/Headers/Strict-Transport-Security |

This is to set "Strict-Transport-Security (HSTS)" header and it's to prevent man-in-the-middle attacks during redirects from
HTTP to HTTPS. To enable this is highly recommended if you use HTTPS (SSL) on your servers.

You can give `true` if you want to enable this rule, or you can specify options by giving `[true, OPTION_OBJECT]` . By default,
this sets `max-age` to two years (63,072,000 seconds).

### `frameGuard`
```ts
{
  frameGuard: false | "deny" | "sameorigin" | ["allow-from", { uri: string | URL }];
}
```

| Default Value | MDN                                                                 |
|---------------|---------------------------------------------------------------------|
| `"deny"`      | https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Frame-Options |

This is to set "X-Frame-Options" header and it's to prevent clickjacking attacks. `"deny"` is highly recommended if you don't
use frame elements such as `iframe` .

### `noopen`
```ts
{
  noopen: false | "noopen";
}
```

| Default Value | MDN                                                                    |
|---------------|------------------------------------------------------------------------|
| `"noopen"`    | https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Download-Options |

This is to set "X-Download-Options" header and it's to prevent to open downloaded files automatically for IE8+ (MIME Handling
attacks).

### `nosniff`
```ts
{
  nosniff: false | "nosniff";
}
```

| Default Value | MDN                                                                        |
|---------------|----------------------------------------------------------------------------|
| `"nosniff"`   | https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Content-Type-Options |

This is to set "X-Content-Type-Options" header and it's to prevent MIME Sniffing attacks.

### `xssProtection`
```ts
{
  xssProtection: false | "sanitize" | "block-rendering" | ["report", { uri: string | URL }];
}
```

| Default Value | MDN                                                                  |
|---------------|----------------------------------------------------------------------|
| `"sanitize"`  | https://developer.mozilla.org/docs/Web/HTTP/Headers/X-XSS-Protection |

This is to set "X-XSS-Protection" header and it's to prevent XSS attacks.

If you specify `"sanitize"` , this sets the header to `"1"` and browsers will sanitize unsafe area. If you specify
`"block-rendering"` , this sets the header to `"1; mode=block"` and browsers will block rendering a page. "X-XSS-Protection"
blocks many XSS attacks, but Content Security Policy is recommended to use compared to this.

### `contentSecurityPolicy`
```ts
{
  contentSecurityPolicy:
    | false
    | {
        directives:
          & Partial<{
            childSrc: string | string[];
            connectSrc: string | string[];
            defaultSrc: string | string[];
            fontSrc: string | string[];
            frameSrc: string | string[];
            imgSrc: string | string[];
            manifestSrc: string | string[];
            mediaSrc: string | string[];
            prefetchSrc: string | string[];
            objectSrc: string | string[];
            scriptSrc: string | string[];
            scriptSrcElem: string | string[];
            scriptSrcAttr: string | string[];
            styleSrc: string | string[];
            styleSrcElem: string | string[];
            styleSrcAttr: string | string[];
            workerSrc: string | string[];
          }>
          & Partial<{
            baseURI: string | string[];
            pluginTypes: string | string[];
            sandbox:
              | true
              | "allow-downloads-without-user-activation"
              | "allow-forms"
              | "allow-modals"
              | "allow-orientation-lock"
              | "allow-pointer-lock"
              | "allow-popups"
              | "allow-popups-to-escape-sandbox"
              | "allow-presentation"
              | "allow-same-origin"
              | "allow-scripts"
              | "allow-storage-access-by-user-activation"
              | "allow-top-navigation"
              | "allow-top-navigation-by-user-activation";
          }>
          & Partial<{
            formAction: string | string[];
            frameAncestors: string | string[];
            navigateTo: string | string[];
            reportURI: string | URL | (string | URL)[];
            reportTo: string;
          }>;
        reportOnly?: boolean;
      };
}
```

| Default Value | MDN                                                                         |
|---------------|-----------------------------------------------------------------------------|
| `false`       | https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy |

This is to set "Content-Security-Policy" or "Content-Security-Policy-Report-Only" header and it's to prevent to load and execute
non-allowed resources.

If you give true to `reportOnly` , this sets "Content-Security-Policy-Report-Only" to value instead of "Content-Security-Policy".

Also you can specify directives using chain-case names such as `child-src` instead of `childSrc` .

> **❗️ When setting `frameAncestors` :X-Frame-Options takes priority.**
> [Section "Relation to X-Frame-Options" of the CSP Spec](https://w3c.github.io/webappsec-csp/#frame-ancestors-and-frame-options) says: _"If a resource is delivered with a policy that includes a directive named frame-ancestors and whose disposition is "enforce", then the X-Frame-Options header MUST be ignored"_, but Chrome 40 & Firefox 35 ignore the frame-ancestors directive and follow the X-Frame-Options header instead.
> 
> Therefore, if setting `frameAncestors` you should set `frameGuard` to `false`.

### `expectCT`
```ts
{
  expectCT: boolean | [true, Partial<{ maxAge: number; enforce: boolean; reportURI: string | URL }>];
}
```

| Default Value | MDN                                                           |
|---------------|---------------------------------------------------------------|
| `false`       | https://developer.mozilla.org/docs/Web/HTTP/Headers/Expect-CT |

This is to set "Expect-CT" header and it's to tell browsers to expect Certificate Transparency.

### `referrerPolicy`
```ts
{
  referrerPolicy:
    | false
    | "no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin"
    | ("no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin")[];
}
```

| Default Value | MDN                                                                 |
|---------------|---------------------------------------------------------------------|
| `false`       | https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy |

This is to set "Referrer-Policy" header and it's to prevent to be got referrer by other servers. You can specify one or more
values for legacy browsers which does not support a specific value.


## API
### `createSecureHeaders`
```ts
import { createSecureHeaders } from "next-secure-headers";

createSecureHeaders({ referrerPolicy: "same-origin" });
// [
//   {
//     key: "Referrer-Policy",
//     value: "same-origin",
//   },
// ]
```

`createSecureHeaders` is a function to return headers as object following a format like `{ key, value }` .

```ts
createSecureHeaders(OPTIONS);
```

The first argument accepts options for rules.

### `withSecureHeaders`
```ts
import { withSecureHeaders } from "next-secure-headers";

export default withSecureHeaders({ referrerPolicy: "same-origin" })(Page);
```

`withSecureHeaders` is a HOC to specify headers using `getServerSideProps` . You can use this function for application
( `/pages/_app.tsx` ) and page components ( `/pages/xxx.tsx` ). **THIS IS NOT AVAILBLE IN `next.config.js` .**

```ts
withSecureHeaders(OPTIONS)(APPLICATION_OR_COMPONENT);
```

The first argument accepts options for rules, and the argument of the returned function accepts application or page components.
The returned value is a new React component.

### `createHeadersObject`
```ts
import { createHeadersObject } from "next-secure-headers";

createHeadersObject({ referrerPolicy: "same-origin" });
// {
//   "Referrer-Policy": "same-origin",
// }
```

`createHeadersObject` is a function to return headers as object.

```ts
createHeadersObject(OPTIONS);
```

The first argument accepts options for rules.


## Recipes
### How to remove X-Powered-By header
In general, X-Powered-By HTTP response header should be removed from response headers because it helps hackers to get the server
information.

next-secure-headers does not support to remove X-Powered-By header, but Next.js supports to do.

```ts
// next.config.js
module.exports = {
  poweredByHeader: false,
};
```

If you give false to `poweredByHeader` in `next.config.js` , Next.js removes the header from response headers.

### Overrides headers in a specific page using `withSecureHeaders`
```ts
// /pages/_app.tsx
export default withSecureHeaders({ referrerPolicy: "same-origin" })(Application);

// /pages/about.tsx
export default withSecureHeaders({ referrerPolicy: "no-referrer-when-downgrade" })(Page);
// But actually the server responds "same-origin"...
```

next-secure-headers does not support to override response headers in child page components because of being restricted by Next.js
architecture.

```ts
// /config/secure-headers.ts
import { withSecureHeaders } from "next-secure-headers";

export const secureHeadersDefaultOption: Parameters<typeof withSecureHeaders>[0] = {
  referrerPolicy: "same-origin",
};

// /pages/_app.tsx
import { secureHeadersDefaultOption } from "../config/secure-headers";

export default withSecureHeaders(secureHeadersDefaultOption)(Application);

// /pages/about.tsx
export default withSecureHeaders({
  ...secureHeadersDefaultOption,
  referrerPolicy: "no-referrer-when-downgrade",
})(Page);
```

To solve this, you should define the option as one module, then you should import and merge the object.


## Contributing to next-secure-headers
Bug reports and pull requests are welcome on GitHub at
[https://github.com/jagaapple/next-secure-headers](https://github.com/jagaapple/next-secure-headers). This project
is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the
[Contributor Covenant](http://contributor-covenant.org) code of conduct.

Please read [Contributing Guidelines](./.github/CONTRIBUTING.md) before development and contributing.


## License
The library is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).

Copyright 2020 Jaga Apple. All rights reserved.
