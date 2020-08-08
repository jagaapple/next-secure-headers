import * as React from "react";
import { ServerResponse } from "http";

import { rules } from "./rules";
import type {
  ContentSecurityPolicyOption,
  ExpectCTOption,
  ForceHTTPSRedirectOption,
  FrameGuardOption,
  NoopenOption,
  NosniffOption,
  ReferrerPolicyOption,
  XSSProtectionOption,
} from "./rules";

type Options = Partial<{
  /**
   * This is to set "Content-Security-Policy" or "Content-Security-Policy-Report-Only" header and it's to prevent to load and
   * execute non-allowed resources.
   * If you give true to `reportOnly` , this sets "Content-Security-Policy-Report-Only" to value instead of
   * "Content-Security-Policy".
   */
  contentSecurityPolicy: ContentSecurityPolicyOption;
  /**
   * This is to set "Expect-CT" header and it's to tell browsers to expect Certificate Transparency.
   */
  expectCT: ExpectCTOption;
  /**
   * This is to set "Strict-Transport-Security (HSTS)" header and it's to prevent man-in-the-middle attacks during redirects from HTTP to HTTPS.
   * To enable this is highly recommended if you use HTTPS (SSL) on your servers.
   * By default, this sets `max-age` to two years (63,072,000 seconds).
   * @default [true, { maxAge: 63072000 }]
   */
  forceHTTPSRedirect: ForceHTTPSRedirectOption;
  /**
   * This is to set "X-Frame-Options" header and it's to prevent clickjacking attacks.
   * `"deny"` is highly recommended if you don't use frame elements such as `iframe` .
   * @default "deny"
   */
  frameGuard: FrameGuardOption;
  /**
   * This is to set "X-Download-Options" header and it's to prevent to open downloaded files automatically for IE8+ (MIME Handling attacks).
   * @default "noopen"
   */
  noopen: NoopenOption;
  /**
   * This is to set "X-Content-Type-Options" header and it's to prevent MIME Sniffing attacks.
   * @default "nosniff"
   */
  nosniff: NosniffOption;
  /**
   * This is to set "Referrer-Policy" header and it's to prevent to be got referrer by other servers.
   * You can specify one or more values for legacy browsers which does not support a specific value.
   */
  referrerPolicy: ReferrerPolicyOption;
  /**
   * This is to set "X-XSS-Protection" header and it's to prevent XSS attacks.
   * If you specify `"sanitize"` , this sets the header to `"1"` and browsers will sanitize unsafe area.
   * If you specify `"block-rendering"` , this sets the header to `"1; mode=block"` and browsers will block rendering a page.
   * "X-XSS-Protection" blocks many XSS attacks, but Content Security Policy is recommended to use compared to this.
   * @default "sanitize"
   */
  xssProtection: XSSProtectionOption;
}>;

export const createHeadersObject = (options: Options = {}) => {
  const newHeaders: Record<string, string> = {};

  [
    rules.createContentSecurityPolicyHeader(options.contentSecurityPolicy),
    rules.createExpectCTHeader(options.expectCT),
    rules.createForceHTTPSRedirectHeader(options.forceHTTPSRedirect),
    rules.createFrameGuardHeader(options.frameGuard),
    rules.createNoopenHeader(options.noopen),
    rules.createNosniffHeader(options.nosniff),
    rules.createReferrerPolicyHeader(options.referrerPolicy),
    rules.createXSSProtectionHeader(options.xssProtection),
  ].forEach((header) => {
    if (header == undefined) return;
    if (header.value == undefined) return;

    newHeaders[header.name] = header.value;
  });

  return newHeaders;
};

export const createSecureHeaders = (options: Options = {}) => {
  const headersObject = createHeadersObject(options);

  const headers: { key: string; value: string }[] = [];
  Object.entries(headersObject).forEach(([key, value]) => {
    headers.push({ key, value });
  });

  return headers;
};

type NextPageContext = { res?: ServerResponse };
type NextAppContext = { ctx?: NextPageContext };
type NextComponent<P = any, IP = {}> = React.ComponentType<P> & {
  getInitialProps?(context: NextPageContext & NextAppContext): IP | Promise<IP>;
};

export const withSecureHeaders = (options: Options = {}) => (ChildComponent: NextComponent) => {
  const Component: NextComponent = (props: any) => React.createElement(ChildComponent, props);

  Component.getInitialProps = async (context) => {
    if (context == undefined) throw new Error("Cannnot find a context in getInitialProps");

    const initialProps = (await ChildComponent.getInitialProps?.(context)) ?? {};
    const res = context.res ?? context.ctx?.res;
    if (res == undefined) return initialProps;
    if (res.headersSent) return initialProps;

    const headers = createHeadersObject(options);
    Object.entries(headers).forEach(([name, value]) => res.setHeader(name, value));

    return initialProps;
  };

  return Component;
};
