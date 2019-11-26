import * as rules from "./rules";

type Options = Partial<{
  forceHTTPSRedirect: rules.ForceHTTPSRedirectOption;
  frameGuard: rules.FrameGuardOption;
  noopen: rules.NoopenOption;
  nosniff: rules.NosniffOption;
  xssProtection: rules.XSSProtectionOption;
}>;

export const createHeadersObject = (options: Options = {}) => {
  const newHeaders: Record<string, string> = {};

  [
    rules.createForceHTTPSRedirectHeader(options.forceHTTPSRedirect),
    rules.createFrameGuardHeader(options.frameGuard),
    rules.createNoopenHeader(options.noopen),
    rules.createNosniffHeader(options.nosniff),
    rules.createXSSProtectionHeader(options.xssProtection),
  ].forEach((header) => {
    if (header.value == undefined) return;

    newHeaders[header.name] = header.value;
  });

  return newHeaders;
};
