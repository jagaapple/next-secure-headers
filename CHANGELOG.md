# Changelog
## 2.2.0 (2021-02-25)
- Add navigation directives #41 - [@naotone](https://github.com/naotone)
  - Support `form-action` `frame-ancestors` directives
  - Move to `navigation-to` directive from ReportingDirective to NavigationDirective
- Add about frame-ancestors CSP directive to readme #46 - [@mattdell](https://github.com/mattdell)
- Improve development environment
  - Update dependencies - [@jagaapple](https://github.com/jagaapple)

## 2.1.0 (2020-12-27)
- Add support for Node.js 14 #36 - [@jagaapple](https://github.com/jagaapple)
- Add support for chain-case directive styles to CSP #40 - [@jagaapple](https://github.com/jagaapple)
- Fix readme #37 - [@jagaapple](https://github.com/jagaapple)
- Fix `invalid bin field` warning #39 - [@jagaapple](https://github.com/jagaapple)
- Fix `report-to` directive #38
  - Fix parse processes
  - Fix invalid value like `undefined <directive-name>` when `report-uri` or `report-to` is specified
- Improve development environment
  - Update dependencies #34 - [@jagaapple](https://github.com/jagaapple)
  - Change Node.js version in development #34 - [@jagaapple](https://github.com/jagaapple)

## 2.0.0 (2020-08-08)
- Add support for static pages without any servers 🎉
  - Add `createSecureHeaders` function #25 - [@jagaapple](https://github.com/jagaapple)
  - Remove default export #24 - [@jagaapple](https://github.com/jagaapple)
- Improve development environment
  - Migrate to GitHub Actions #21 - [@jagaapple](https://github.com/jagaapple)
  - Update dependencies #23 - [@jagaapple](https://github.com/jagaapple)

### ❗️Breaking Changes
The default export has been removed, `withSecureHeaders` function has been exported as named export instead.
You have to import `withSecureHeaders` like the following.

```diff
- import withSecureHeaders from "next-secure-headers";
+ import { withSecureHeaders } from "next-secure-headers";
```

## 1.0.1 (2019-12-13)
- Fix setting headers after sending #10 - [@jagaapple](https://github.com/jagaapple)
- Improve development environment
  - Enable automatic code formatting for VS Code #8 - [@jagaapple](https://github.com/jagaapple)

## 1.0.0 (2019-12-04)
- Initial public release - [@jagaapple](https://github.com/jagaapple)

## 0.0.1 (2019-11-22)
- Initial private release - [@jagaapple](https://github.com/jagaapple)
