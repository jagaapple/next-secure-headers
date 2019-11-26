import { ResponseHeader } from "../shared";

export type NosniffOption = false | "nosniff";

const headerName = "X-Content-Type-Options";
const defaultValue: NosniffOption = "nosniff";

const createXContentTypeOptionsHeaderValue = (option?: NosniffOption) => {
  if (option == undefined) return defaultValue;
  if (option === false) return;
  if (option === "nosniff") return defaultValue;

  throw new Error(`Invalid value for ${headerName}: ${option}`);
};

export const createNosniffHeader = (option?: NosniffOption): ResponseHeader => {
  const value = createXContentTypeOptionsHeaderValue(option);

  return { name: headerName, value };
};
