# Changelog
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
