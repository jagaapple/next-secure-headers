import { ResponseHeader } from "../shared";

export type NoopenOption = false | "noopen";

const headerName = "X-Download-Options";
const defaultValue: NoopenOption = "noopen";

const createXDownloadOptionsHeaderValue = (option?: NoopenOption) => {
  if (option == undefined) return defaultValue;
  if (option === false) return;
  if (option === "noopen") return defaultValue;

  throw new Error(`Invalid value for ${headerName}: ${option}`);
};

export const createNoopenHeader = (option?: NoopenOption): ResponseHeader => {
  const value = createXDownloadOptionsHeaderValue(option);

  return { name: headerName, value };
};
