import { ResponseHeader } from "../shared";
import { encodeStrictURI } from "./shared";

export type FrameGuardOption = false | "deny" | "sameorigin" | ["allow-from", { uri: string | URL }];

const headerName = "X-Frame-Options";

export const createXFrameOptionsHeaderValue = (
  option?: FrameGuardOption,
  strictURIEncoder = encodeStrictURI,
): string | undefined => {
  if (option == undefined) return "deny";
  if (option === false) return;
  if (option === "deny") return option;
  if (option === "sameorigin") return option;

  if (Array.isArray(option)) {
    if (option[0] === "allow-from") return `${option[0]} ${strictURIEncoder(option[1].uri)}`;
  }

  throw new Error(`Invalid value for ${headerName}: ${option}`);
};

export const createFrameGuardHeader = (
  option?: FrameGuardOption,
  headerValueCreator = createXFrameOptionsHeaderValue,
): ResponseHeader => {
  const value = headerValueCreator(option);

  return { name: headerName, value };
};
