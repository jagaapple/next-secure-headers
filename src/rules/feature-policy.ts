import type { ResponseHeader } from "../shared";

export const supportedValues = [
  "accelerometer",
  "ambient-light-sensor",
  "autoplay",
  "battery",
  "camera",
  "display-capture",
  "document-domain",
  "encrypted-media",
  "execution-while-not-rendered",
  "execution-while-out-of-viewport",
  "fullscreen",
  "geolocation",
  "gyroscope",
  "layout-animations",
  "legacy-image-formats",
  "magnetometer",
  "microphone",
  "midi",
  "navigation-override",
  "oversized-images",
  "payment",
  "picture-in-picture",
  "publickey-credentials-get",
  "sync-xhr",
  "usb",
  "vr",
  "wake-lock",
  "screen-wake-lock",
  "web-share",
  "xr-spatial-tracking",
] as const;
export type FeaturePolicyDirectiveName = typeof supportedValues[number];

export type FeaturePolicyDirectiveParameters = {
  none?: boolean;
  all?: boolean;
  self?: boolean;
  origins?: string[];
};

export type FeaturePolicyOptions = false | Partial<Record<FeaturePolicyDirectiveName, FeaturePolicyDirectiveParameters>>;

const HEADER_NAME = "Feature-Policy";

export const createFeaturePolicyHeaderValue = (options?: FeaturePolicyOptions): string | undefined => {
  if (!options) return;

  const value = Object.keys(options)
    .reduce((str, directiveName) => {
      if (!supportedValues.includes(directiveName as FeaturePolicyDirectiveName)) {
        throw new Error(`Invalid directive for ${HEADER_NAME}: ${directiveName}`);
      }

      const directiveParameters = options[directiveName as FeaturePolicyDirectiveName];
      if (!directiveParameters) {
        throw new Error(`Invalid directive parameters for ${HEADER_NAME}: ${directiveName}`);
      }
      const { none, all, self, origins } = directiveParameters;

      if (none) return `${str}${directiveName} 'none'; `;
      if (all) return `${str}${directiveName} *; `;

      if (!self && (!origins || !origins.length)) {
        throw new Error(`Invalid directive parameters for ${HEADER_NAME}: ${directiveName}`);
      }

      let value = `${str}${directiveName}`;

      if (self) value = `${value} 'self'`;
      if (origins && origins.length) value = `${value} ${origins.join(" ")}`;

      return `${value}; `;
    }, "")
    .trim();

  return value;
};

export const createFeaturePolicyHeader = (
  options?: FeaturePolicyOptions,
  headerValueCreator = createFeaturePolicyHeaderValue,
): ResponseHeader | undefined => {
  if (!options) return;

  const value = headerValueCreator(options);

  return { name: HEADER_NAME, value };
};
