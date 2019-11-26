import { ResponseHeader } from "../shared";

export type XSSProtectionOption = false | "sanitize" | "block-rendering" | ["report", { uri: string | URL }];

const headerName = "X-XSS-Protection";

const createXXSSProtectionHeaderValue = (option?: XSSProtectionOption) => {
  if (option == undefined) return "1";
  if (option === false) return "0";
  if (option === "sanitize") return "1";
  if (option === "block-rendering") return "1; mode=block";

  if (Array.isArray(option)) {
    if (option[0] === "report") return `1; report=${new URL(option[1].uri.toString())}`;
  }

  throw new Error(`Invalid value for ${headerName}: ${option}`);
};

export const createXSSProtectionHeader = (option?: XSSProtectionOption): ResponseHeader => {
  const value = createXXSSProtectionHeaderValue(option);

  return { name: headerName, value };
};
