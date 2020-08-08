import type { ResponseHeader } from "../shared";

export type NosniffOption = false | "nosniff";

const headerName = "X-Content-Type-Options";

export const createXContentTypeOptionsHeaderValue = (option?: NosniffOption): string | undefined => {
  if (option == undefined) return "nosniff";
  if (option === false) return;
  if (option === "nosniff") return option;

  throw new Error(`Invalid value for ${headerName}: ${option}`);
};

export const createNosniffHeader = (
  option?: NosniffOption,
  headerValueCreator = createXContentTypeOptionsHeaderValue,
): ResponseHeader => {
  const value = headerValueCreator(option);

  return { name: headerName, value };
};
