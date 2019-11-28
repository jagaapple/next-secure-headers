import { ResponseHeader } from "../shared";

export type ExpectCTOption = boolean | [true, Partial<{ maxAge: number; enforce: boolean; reportURI: string | URL }>];

const headerName = "Expect-CT";
const defaultMaxAge = 60 * 60 * 24; // 1 day

export const createExpectCTHeaderValue = (option?: ExpectCTOption): string | undefined => {
  if (option == undefined) return;
  if (option === false) return;
  if (option === true) return `max-age=${defaultMaxAge}`;

  if (Array.isArray(option)) {
    if (option[0] !== true) throw new Error(`Invalid value for ${headerName} in the first option: ${option[0]}`);

    const maxAge = option[1].maxAge ?? defaultMaxAge;
    if (typeof maxAge !== "number" || !Number.isFinite(maxAge)) {
      throw new Error(`Invalid value for "maxAge" option in ${headerName}: ${maxAge}`);
    }
    const { enforce, reportURI } = option[1];

    return [
      `max-age=${maxAge}`,
      enforce ? "enforce" : undefined,
      reportURI != undefined ? `report-uri=${new URL(reportURI.toString())}` : undefined,
    ]
      .filter((value) => value != undefined)
      .join(", ");
  }

  throw new Error(`Invalid value for ${headerName}: ${option}`);
};

export const createExpectCTHeader = (
  option?: ExpectCTOption,
  headerValueCreator = createExpectCTHeaderValue,
): ResponseHeader => {
  const value = headerValueCreator(option);

  return { name: headerName, value };
};
