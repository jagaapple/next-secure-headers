import { ResponseHeader } from "./shared";

export type ForceHTTPSRedirectOption =
  | boolean
  | [true | number]
  | [true | number, Partial<{ includeSubDomains: boolean; preload: boolean }>];

const headerName = "Strict-Transport-Security";
const defaultMaxAge = 60 * 60 * 24 * 365 * 2; // 2 years

const createHSTSHeaderValue = (option?: ForceHTTPSRedirectOption) => {
  if (option == undefined) return `max-age=${defaultMaxAge}`;
  if (option === false) return;
  if (option === true) return `max-age=${defaultMaxAge}`;

  if (Array.isArray(option)) {
    if (typeof option[0] === "number" && !Number.isFinite(option[0])) {
      throw new Error(`Invalid number for ${headerName} in the first option: ${option[0]}`);
    }
    if (typeof option[0] !== "number" && option[0] !== true) {
      throw new Error(`Invalid value for ${headerName} in the first option: ${option[0]}`);
    }

    const maxAge = typeof option[0] === "number" ? option[0] : defaultMaxAge;
    const { includeSubDomains, preload } = option[1] ?? {};

    return [`max-age=${maxAge}`, includeSubDomains ? "includeSubDomains" : undefined, preload ? "preload" : undefined]
      .filter((value) => value != undefined)
      .join("; ");
  }

  throw new Error(`Invaild value for ${headerName}: ${option}`);
};

export const createForceHTTPSRedirectHeader = (option?: ForceHTTPSRedirectOption): ResponseHeader => {
  const value = createHSTSHeaderValue(option);

  return { name: headerName, value };
};
