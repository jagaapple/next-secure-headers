export const encodeStrictURI = (uri: string | URL) => new URL(uri.toString()).toString();
