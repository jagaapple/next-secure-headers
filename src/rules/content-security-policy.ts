import type { ResponseHeader } from "../shared";
import { encodeStrictURI, wrapArray } from "./shared";

type DirectiveSource = string | string[];
type PluginTypes = string | string[];
type Sandbox =
  | true
  | "allow-downloads-without-user-activation"
  | "allow-forms"
  | "allow-modals"
  | "allow-orientation-lock"
  | "allow-pointer-lock"
  | "allow-popups"
  | "allow-popups-to-escape-sandbox"
  | "allow-presentation"
  | "allow-same-origin"
  | "allow-scripts"
  | "allow-storage-access-by-user-activation"
  | "allow-top-navigation"
  | "allow-top-navigation-by-user-activation";

type FetchDirective = {
  childSrc: DirectiveSource;
  connectSrc: DirectiveSource;
  defaultSrc: DirectiveSource;
  fontSrc: DirectiveSource;
  frameSrc: DirectiveSource;
  imgSrc: DirectiveSource;
  manifestSrc: DirectiveSource;
  mediaSrc: DirectiveSource;
  prefetchSrc: DirectiveSource;
  objectSrc: DirectiveSource;
  scriptSrc: DirectiveSource;
  scriptSrcElem: DirectiveSource;
  scriptSrcAttr: DirectiveSource;
  styleSrc: DirectiveSource;
  styleSrcElem: DirectiveSource;
  styleSrcAttr: DirectiveSource;
  workerSrc: DirectiveSource;
};
type DocumentDirective = {
  baseURI: DirectiveSource;
  pluginTypes: PluginTypes;
  sandbox: Sandbox;
};
type ReportingDirective = {
  navigateTo: DirectiveSource;
  reportURI: string | URL | (string | URL)[];
  reportTo: Record<string, any>;
};

export type ContentSecurityPolicyOption =
  | false
  | {
      directives: Partial<FetchDirective> & Partial<DocumentDirective> & Partial<ReportingDirective>;
      reportOnly?: boolean;
    };

const headerName = "Content-Security-Policy";
const reportOnlyHeaderName = "Content-Security-Policy-Report-Only";
const directiveValueSepartor = "; ";

export const getProperHeaderName = (reportOnly = false) => (reportOnly ? reportOnlyHeaderName : headerName);
export const createDirectiveValue = <T>(directiveName: string, value: T | T[], arrayWrapper = wrapArray) => {
  const values = arrayWrapper(value);

  return `${directiveName} ${values.join(" ")}`;
};

const fetchDirectiveNamesByKey: Record<keyof FetchDirective, string> = {
  childSrc: "child-src",
  connectSrc: "connect-src",
  defaultSrc: "default-src",
  fontSrc: "font-src",
  frameSrc: "frame-src",
  imgSrc: "img-src",
  manifestSrc: "manifest-src",
  mediaSrc: "media-src",
  prefetchSrc: "prefetch-src",
  objectSrc: "object-src",
  scriptSrc: "script-src",
  scriptSrcElem: "script-src-elem",
  scriptSrcAttr: "script-src-attr",
  styleSrc: "style-src",
  styleSrcElem: "style-src-elem",
  styleSrcAttr: "style-src-attr",
  workerSrc: "worker-src",
};
export const convertFetchDirectiveToString = (directive?: Partial<FetchDirective>) => {
  if (directive == undefined) return "";

  const strings: string[] = [];
  Object.entries(directive).forEach(([key, value]) => {
    if (value == undefined) return;

    const directiveName = fetchDirectiveNamesByKey[key as keyof FetchDirective];
    strings.push(createDirectiveValue(directiveName, wrapArray(value)));
  });

  return strings.join(directiveValueSepartor);
};

export const convertDocumentDirectiveToString = (directive?: Partial<DocumentDirective>) => {
  if (directive == undefined) return "";

  const strings: string[] = [];

  if (directive.baseURI != undefined) strings.push(createDirectiveValue("base-uri", wrapArray(directive.baseURI)));
  if (directive.pluginTypes != undefined) strings.push(createDirectiveValue("plugin-types", wrapArray(directive.pluginTypes)));
  if (directive.sandbox != undefined) {
    const directiveName = "sandbox";
    const value = directive.sandbox === true ? directiveName : createDirectiveValue(directiveName, directive.sandbox);
    strings.push(value);
  }

  return strings.join(directiveValueSepartor);
};

export const convertReportingDirectiveToString = (directive?: Partial<ReportingDirective>) => {
  if (directive == undefined) return "";

  const strings: string[] = [];

  if (directive.navigateTo != undefined) strings.push(createDirectiveValue("navigate-to", wrapArray(directive.navigateTo)));
  if (directive.reportURI != undefined) {
    const reportURI = wrapArray(directive.reportURI).map(encodeStrictURI);
    strings.push(createDirectiveValue("report-uri", reportURI));
  }
  if (directive.reportTo != undefined) strings.push(createDirectiveValue("report-to", JSON.stringify(directive.reportTo)));

  return strings.join(directiveValueSepartor);
};

export const createContentSecurityPolicyOptionHeaderValue = (
  option?: ContentSecurityPolicyOption,
  fetchDirectiveToStringConverter = convertFetchDirectiveToString,
  documentDirectiveToStringConverter = convertDocumentDirectiveToString,
  reportingDirectiveToStringConverter = convertReportingDirectiveToString,
): string | undefined => {
  if (option == undefined) return;
  if (option === false) return;

  return [
    fetchDirectiveToStringConverter(option.directives),
    documentDirectiveToStringConverter(option.directives),
    reportingDirectiveToStringConverter(option.directives),
  ]
    .filter((string) => string.length > 0)
    .join(directiveValueSepartor);
};

export const createContentSecurityPolicyHeader = (
  option?: ContentSecurityPolicyOption,
  properHeaderNameGetter = getProperHeaderName,
  headerValueCreator = createContentSecurityPolicyOptionHeaderValue,
): ResponseHeader | undefined => {
  if (option == undefined) return;
  if (option === false) return;

  const headerName = properHeaderNameGetter(option.reportOnly);
  const value = headerValueCreator(option);

  return { name: headerName, value };
};
