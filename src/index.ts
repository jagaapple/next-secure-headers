import * as React from "react";
import { ServerResponse } from "http";

import * as rules from "./rules";

type Options = Partial<{
  /**
   * This is to set "Expect-CT" header and it's to tell browsers to expect Certificate Transparency.
   */
  expectCT: rules.ExpectCTOption;
  /**
   * This is to set "Strict-Transport-Security (HSTS)" header and it's to prevent man-in-the-middle attacks during redirects from HTTP to HTTPS.
   * To enable this is highly recommended if you use HTTPS (SSL) on your servers.
   * By default, this is set two years (63,072,000 seconds) as `max-age` .
   * @default [63072000]
   */
  forceHTTPSRedirect: rules.ForceHTTPSRedirectOption;
  /**
   * This is to set "X-Frame-Options" header and it's to prevent clickjacking attacks.
   * `"deny"` is highly recommendeed if you doesn't use frame elements such as `iframe` .
   * @default "deny"
   */
  frameGuard: rules.FrameGuardOption;
  /**
   * This is to set "X-Download-Options" header and it's to prevent to open downloaded files automatically for IE8+ (MIME Handling attacks).
   * @default "noopen"
   */
  noopen: rules.NoopenOption;
  /**
   * This is to set "X-Content-Type-Options" header and it's to prevent MIME Sniffing attacks.
   * @default "nosniff"
   */
  nosniff: rules.NosniffOption;
  /**
   * This is to set "Referrer-Policy" header and it's to prevent to be got referrer by other servers.
   * You can specify one or more values for legacy browsers which does not support a specific value.
   */
  referrerGuard: rules.ReferrerGuardOption;
  /**
   * This is to set "X-XSS-Protection" header and it's to prevent XSS attacks.
   * If you specify `"sanitize"` , this sets `"1"` to the header and browsers will sanitize unsafe area.
   * If you specify `"block-rendering"` , this sets `"1; mode=block"` to the header and browsers will block rendering a page.
   * "X-XSS-Protection" blocks many XSS attacks, but Contents Security Policy is recommended to use comapred to this.
   * @default "sanitize"
   */
  xssProtection: rules.XSSProtectionOption;
}>;

export const createHeadersObject = (options: Options = {}) => {
  const newHeaders: Record<string, string> = {};

  [
    rules.createExpectCTHeader(options.expectCT),
    rules.createForceHTTPSRedirectHeader(options.forceHTTPSRedirect),
    rules.createFrameGuardHeader(options.frameGuard),
    rules.createNoopenHeader(options.noopen),
    rules.createNosniffHeader(options.nosniff),
    rules.createReferrerGuardHeader(options.referrerGuard),
    rules.createXSSProtectionHeader(options.xssProtection),
  ].forEach((header) => {
    if (header.value == undefined) return;

    newHeaders[header.name] = header.value;
  });

  return newHeaders;
};

type NextPageContext = { res?: ServerResponse };
type NextAppContext = { ctx?: NextPageContext };
type NextComponent<P = any, IP = {}> = React.ComponentType<P> & {
  getInitialProps?(context: NextPageContext & NextAppContext): IP | Promise<IP>;
};

export default (options: Options = {}) => (ChildComponent: NextComponent) => {
  const Component: NextComponent = (props: any) => React.createElement(ChildComponent, props);

  Component.getInitialProps = async (context) => {
    if (context == undefined) throw new Error("Cannnot find a context in getInitialProps");

    const initialProps = (await ChildComponent.getInitialProps?.(context)) ?? {};
    const res = context.res ?? context.ctx?.res;
    if (res == undefined) return initialProps;

    const headers = createHeadersObject(options);
    Object.entries(headers).forEach(([name, value]) => res.setHeader(name, value));

    return initialProps;
  };

  return Component;
};
