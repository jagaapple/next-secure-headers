import { createContentSecurityPolicyHeader } from "./content-security-policy";
import { createExpectCTHeader } from "./expect-ct";
import { createFeaturePolicyHeader } from "./feature-policy";
import { createForceHTTPSRedirectHeader } from "./force-https-redirect";
import { createFrameGuardHeader } from "./frame-guard";
import { createNoopenHeader } from "./noopen";
import { createNosniffHeader } from "./nosniff";
import { createReferrerPolicyHeader } from "./referrer-policy";
import { createXSSProtectionHeader } from "./xss-protection";

export type { ContentSecurityPolicyOption } from "./content-security-policy";
export type { ExpectCTOption } from "./expect-ct";
export type { FeaturePolicyOptions } from "./feature-policy";
export type { ForceHTTPSRedirectOption } from "./force-https-redirect";
export type { FrameGuardOption } from "./frame-guard";
export type { NoopenOption } from "./noopen";
export type { NosniffOption } from "./nosniff";
export type { ReferrerPolicyOption } from "./referrer-policy";
export type { XSSProtectionOption } from "./xss-protection";

// From TypeScript 3.9 has been set `enumerable: false` so we cannot `import * as rules` and `jest.spyOn(rules, "xxx")` ,
// so exports manually.
export const rules = {
  createContentSecurityPolicyHeader,
  createExpectCTHeader,
  createFeaturePolicyHeader,
  createForceHTTPSRedirectHeader,
  createFrameGuardHeader,
  createNoopenHeader,
  createNosniffHeader,
  createReferrerPolicyHeader,
  createXSSProtectionHeader,
};
