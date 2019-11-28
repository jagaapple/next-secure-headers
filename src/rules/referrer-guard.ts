import { ResponseHeader } from "../shared";

const supportedValues = [
  "no-referrer",
  "no-referrer-when-downgrade",
  "origin",
  "origin-when-cross-origin",
  "same-origin",
  "strict-origin",
  "strict-origin-when-cross-origin",
] as const;
type SupportedValue = typeof supportedValues[number];
export type ReferrerGuardOption = false | SupportedValue | SupportedValue[];

const headerName = "Referrer-Policy";

export const createReferrerPolicyHeaderValue = (option?: ReferrerGuardOption): string | undefined => {
  if (option == undefined) return;
  if (option === false) return;

  const values = Array.isArray(option) ? option : [option];

  values.forEach((value) => {
    if ((value as string) === "unsafe-url") throw new Error(`Cannot specify a dangerous value for ${headerName}: ${value}`);
    if (!supportedValues.includes(value)) throw new Error(`Invalid value for ${headerName}: ${value}`);
  });

  return values.join(", ");
};

export const createReferrerGuardHeader = (
  option?: ReferrerGuardOption,
  headerValueCreator = createReferrerPolicyHeaderValue,
): ResponseHeader => {
  const value = headerValueCreator(option);

  return { name: headerName, value };
};
