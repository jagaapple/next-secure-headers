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
  "child-src": DirectiveSource;
  connectSrc: DirectiveSource;
  "connect-src": DirectiveSource;
  defaultSrc: DirectiveSource;
  "default-src": DirectiveSource;
  fontSrc: DirectiveSource;
  "font-src": DirectiveSource;
  frameSrc: DirectiveSource;
  "frame-src": DirectiveSource;
  imgSrc: DirectiveSource;
  "img-src": DirectiveSource;
  manifestSrc: DirectiveSource;
  "manifest-src": DirectiveSource;
  mediaSrc: DirectiveSource;
  "media-src": DirectiveSource;
  prefetchSrc: DirectiveSource;
  "prefetch-src": DirectiveSource;
  objectSrc: DirectiveSource;
  "object-src": DirectiveSource;
  scriptSrc: DirectiveSource;
  "script-src": DirectiveSource;
  scriptSrcElem: DirectiveSource;
  "script-src-elem": DirectiveSource;
  scriptSrcAttr: DirectiveSource;
  "script-src-attr": DirectiveSource;
  styleSrc: DirectiveSource;
  "style-src": DirectiveSource;
  styleSrcElem: DirectiveSource;
  "style-src-elem": DirectiveSource;
  styleSrcAttr: DirectiveSource;
  "style-src-attr": DirectiveSource;
  workerSrc: DirectiveSource;
  "worker-src": DirectiveSource;
};
type DocumentDirective = {
  baseURI: DirectiveSource;
  "base-uri": DirectiveSource;
  pluginTypes: PluginTypes;
  "plugin-types": PluginTypes;
  sandbox: Sandbox;
};
type ReportingDirective = {
  navigateTo: DirectiveSource;
  "navigate-to": DirectiveSource;
  reportURI: string | URL | (string | URL)[];
  "report-uri": string | URL | (string | URL)[];
  reportTo: string;
  "report-to": string;
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
  "child-src": "child-src",
  connectSrc: "connect-src",
  "connect-src": "connect-src",
  defaultSrc: "default-src",
  "default-src": "default-src",
  fontSrc: "font-src",
  "font-src": "font-src",
  frameSrc: "frame-src",
  "frame-src": "frame-src",
  imgSrc: "img-src",
  "img-src": "img-src",
  manifestSrc: "manifest-src",
  "manifest-src": "manifest-src",
  mediaSrc: "media-src",
  "media-src": "media-src",
  prefetchSrc: "prefetch-src",
  "prefetch-src": "prefetch-src",
  objectSrc: "object-src",
  "object-src": "object-src",
  scriptSrc: "script-src",
  "script-src": "script-src",
  scriptSrcElem: "script-src-elem",
  "script-src-elem": "script-src-elem",
  scriptSrcAttr: "script-src-attr",
  "script-src-attr": "script-src-attr",
  styleSrc: "style-src",
  "style-src": "style-src",
  styleSrcElem: "style-src-elem",
  "style-src-elem": "style-src-elem",
  styleSrcAttr: "style-src-attr",
  "style-src-attr": "style-src-attr",
  workerSrc: "worker-src",
  "worker-src": "worker-src",
};
export const convertFetchDirectiveToString = (directive?: Partial<FetchDirective>) => {
  if (directive == undefined) return "";

  const strings: string[] = [];
  Object.entries(directive).forEach(([key, value]) => {
    if (value == undefined) return;

    const directiveName = fetchDirectiveNamesByKey[key as keyof FetchDirective];
    if (directiveName == undefined) return;

    strings.push(createDirectiveValue(directiveName, wrapArray(value)));
  });

  return strings.join(directiveValueSepartor);
};

export const convertDocumentDirectiveToString = (directive?: Partial<DocumentDirective>) => {
  if (directive == undefined) return "";

  const strings: string[] = [];

  const baseURI = directive.baseURI ?? directive["base-uri"];
  if (baseURI != undefined) strings.push(createDirectiveValue("base-uri", wrapArray(baseURI)));

  const pluginTypes = directive.pluginTypes ?? directive["plugin-types"];
  if (pluginTypes != undefined) strings.push(createDirectiveValue("plugin-types", wrapArray(pluginTypes)));

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

  const navigateTo = directive.navigateTo ?? directive["navigate-to"];
  if (navigateTo != undefined) strings.push(createDirectiveValue("navigate-to", wrapArray(navigateTo)));

  const reportURIValue = directive.reportURI ?? directive["report-uri"];
  if (reportURIValue != undefined) {
    const reportURI = wrapArray(reportURIValue).map(encodeStrictURI);
    strings.push(createDirectiveValue("report-uri", reportURI));
  }
  const reportTo = directive.reportTo ?? directive["report-to"];
  if (reportTo != undefined) strings.push(createDirectiveValue("report-to", reportTo));

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
