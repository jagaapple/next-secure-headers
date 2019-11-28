import { ResponseHeader } from "../shared";

export type NoopenOption = false | "noopen";

const headerName = "X-Download-Options";

export const createXDownloadOptionsHeaderValue = (option?: NoopenOption): string | undefined => {
  if (option == undefined) return "noopen";
  if (option === false) return;
  if (option === "noopen") return option;

  throw new Error(`Invalid value for ${headerName}: ${option}`);
};

export const createNoopenHeader = (
  option?: NoopenOption,
  headerValueCreator = createXDownloadOptionsHeaderValue,
): ResponseHeader => {
  const value = headerValueCreator(option);

  return { name: headerName, value };
};
