import { ResponseHeader } from "../shared";

export type FrameGuardOption = false | "deny" | "sameorigin" | ["allow-from", { uri: string | URL }];

const headerName = "X-Frame-Options";
const defaultValue: FrameGuardOption = "deny";

const createXFrameOptionsHeaderValue = (option?: FrameGuardOption) => {
  if (option == undefined) return defaultValue;
  if (option === false) return;
  if (option === "deny") return option;
  if (option === "sameorigin") return option;

  if (Array.isArray(option)) {
    if (option[0] === "allow-from") return `${option[0]} ${new URL(option[1].uri.toString())}`;
  }

  throw new Error(`Invalid value for ${headerName}: ${option}`);
};

export const createFrameGuardHeader = (option?: FrameGuardOption): ResponseHeader => {
  const value = createXFrameOptionsHeaderValue(option);

  return { name: headerName, value };
};
