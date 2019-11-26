import { ResponseHeader } from "../shared";

export type ForceHTTPSRedirectOption =
  | boolean
  | [true, Partial<{ maxAge: number; includeSubDomains: boolean; preload: boolean }>];

const headerName = "Strict-Transport-Security";
const defaultMaxAge = 60 * 60 * 24 * 365 * 2; // 2 years

export const createHSTSHeaderValue = (option?: ForceHTTPSRedirectOption): string | undefined => {
  if (option == undefined) return `max-age=${defaultMaxAge}`;
  if (option === false) return;
  if (option === true) return `max-age=${defaultMaxAge}`;

  if (Array.isArray(option)) {
    if (option[0] !== true) {
      throw new Error(`Invalid value for ${headerName} in the first option: ${option[0]}`);
    }

    const maxAge = option[1].maxAge ?? defaultMaxAge;
    if (typeof maxAge !== "number" || !Number.isFinite(maxAge)) {
      throw new Error(`Invalid value for "maxAge" option in ${headerName}: ${maxAge}`);
    }
    const { includeSubDomains, preload } = option[1];

    return [`max-age=${maxAge}`, includeSubDomains ? "includeSubDomains" : undefined, preload ? "preload" : undefined]
      .filter((value) => value != undefined)
      .join("; ");
  }

  throw new Error(`Invaild value for ${headerName}: ${option}`);
};

export const createForceHTTPSRedirectHeader = (
  option?: ForceHTTPSRedirectOption,
  headerValueCreator = createHSTSHeaderValue,
): ResponseHeader => {
  const value = headerValueCreator(option);

  return { name: headerName, value };
};
