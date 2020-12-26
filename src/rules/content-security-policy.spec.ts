import { wrapArray } from "./shared";
import {
  convertDocumentDirectiveToString,
  convertFetchDirectiveToString,
  convertReportingDirectiveToString,
  createContentSecurityPolicyHeader,
  createContentSecurityPolicyOptionHeaderValue,
  createDirectiveValue,
  getProperHeaderName,
} from "./content-security-policy";

describe("createContentSecurityPolicyHeader", () => {
  context("when giving undefined", () => {
    it("should return undefined", () => {
      expect(createContentSecurityPolicyHeader()).toBeUndefined();
    });
  });

  context("when giving false", () => {
    it("should return undefined", () => {
      expect(createContentSecurityPolicyHeader(false)).toBeUndefined();
    });
  });

  context("when giving an object", () => {
    const dummyOption: Parameters<typeof createContentSecurityPolicyOptionHeaderValue>[0] = {
      directives: { childSrc: "'self'", objectSrc: "https://example.com" },
    };

    let properHeaderNameGetterMock: jest.Mock<ReturnType<typeof getProperHeaderName>, Parameters<typeof getProperHeaderName>>;
    let headerValueCreatorMock: jest.Mock<
      ReturnType<typeof createContentSecurityPolicyOptionHeaderValue>,
      Parameters<typeof createContentSecurityPolicyOptionHeaderValue>
    >;

    beforeEach(() => {
      properHeaderNameGetterMock = jest.fn(getProperHeaderName);
      headerValueCreatorMock = jest.fn(createContentSecurityPolicyOptionHeaderValue);
    });

    it('should call the second argument function and return a value from the function as object\'s "name" property', () => {
      const dummyValue: any = "dummy-value";
      properHeaderNameGetterMock.mockReturnValue(dummyValue);
      expect(createContentSecurityPolicyHeader(dummyOption, properHeaderNameGetterMock)).toHaveProperty("name", dummyValue);
    });

    it('should call the third argument function and return a value from the function as object\'s "value" property', () => {
      const dummyValue = "dummy-value";
      headerValueCreatorMock.mockReturnValue(dummyValue);

      expect(createContentSecurityPolicyHeader(dummyOption, undefined, headerValueCreatorMock)).toHaveProperty(
        "value",
        dummyValue,
      );
    });
  });
});

describe("createContentSecurityPolicyOptionHeaderValue", () => {
  context("when giving undefined", () => {
    it("should return undefined", () => {
      expect(createContentSecurityPolicyOptionHeaderValue()).toBeUndefined();
    });
  });

  context("when giving false", () => {
    it("should return undefined", () => {
      expect(createContentSecurityPolicyOptionHeaderValue(false)).toBeUndefined();
    });
  });

  context("when giving an object", () => {
    const dummyOption: Parameters<typeof createContentSecurityPolicyOptionHeaderValue>[0] = {
      directives: { childSrc: "'self'", objectSrc: "https://example.com" },
    };

    let fetchDirectiveToStringConverterMock: jest.Mock<
      ReturnType<typeof convertFetchDirectiveToString>,
      Parameters<typeof convertFetchDirectiveToString>
    >;
    let documentDirectiveToStringConverterMock: jest.Mock<
      ReturnType<typeof convertDocumentDirectiveToString>,
      Parameters<typeof convertDocumentDirectiveToString>
    >;
    let reportingDirectiveToStringConverterMock: jest.Mock<
      ReturnType<typeof convertReportingDirectiveToString>,
      Parameters<typeof convertReportingDirectiveToString>
    >;

    beforeEach(() => {
      fetchDirectiveToStringConverterMock = jest.fn(convertFetchDirectiveToString);
      documentDirectiveToStringConverterMock = jest.fn(convertDocumentDirectiveToString);
      reportingDirectiveToStringConverterMock = jest.fn(convertReportingDirectiveToString);
    });

    it("should call the second argument with directives", () => {
      createContentSecurityPolicyOptionHeaderValue(dummyOption, fetchDirectiveToStringConverterMock);

      expect(fetchDirectiveToStringConverterMock).toBeCalledWith(dummyOption.directives);
    });

    it("should call the third argument with directives", () => {
      createContentSecurityPolicyOptionHeaderValue(dummyOption, undefined, documentDirectiveToStringConverterMock);

      expect(documentDirectiveToStringConverterMock).toBeCalledWith(dummyOption.directives);
    });

    it("should call the fourth argument with directives", () => {
      createContentSecurityPolicyOptionHeaderValue(dummyOption, undefined, undefined, reportingDirectiveToStringConverterMock);

      expect(reportingDirectiveToStringConverterMock).toBeCalledWith(dummyOption.directives);
    });

    it('should join directive strings using "; "', () => {
      fetchDirectiveToStringConverterMock.mockReturnValue("dummy-value-1");
      documentDirectiveToStringConverterMock.mockReturnValue("");
      reportingDirectiveToStringConverterMock.mockReturnValue("dummy-value-3");

      expect(
        createContentSecurityPolicyOptionHeaderValue(
          dummyOption,
          fetchDirectiveToStringConverterMock,
          documentDirectiveToStringConverterMock,
          reportingDirectiveToStringConverterMock,
        ),
      ).toBe("dummy-value-1; dummy-value-3");
    });
  });
});

describe("getProperHeaderName", () => {
  context("when calling without arguments", () => {
    it('should return "Content-Security-Policy"', () => {
      expect(getProperHeaderName()).toBe("Content-Security-Policy");
    });
  });

  context("when giving false", () => {
    it('should return "Content-Security-Policy"', () => {
      expect(getProperHeaderName(false)).toBe("Content-Security-Policy");
    });
  });

  context("when giving true", () => {
    it('should return "Content-Security-Policy-Report-Only"', () => {
      expect(getProperHeaderName(true)).toBe("Content-Security-Policy-Report-Only");
    });
  });
});

describe("createDirectiveValue", () => {
  let arrayWrapperMock: jest.Mock<any, any>;
  beforeEach(() => {
    arrayWrapperMock = jest.fn(wrapArray);
  });

  it("should join arguments using one half-space", () => {
    const directiveName = "dummy-directive";
    const values = ["1", "2", "3"];

    expect(createDirectiveValue(directiveName, values)).toBe(`${directiveName} ${values.join(" ")}`);
    expect(createDirectiveValue(directiveName, values[0])).toBe(`${directiveName} ${values[0]}`);
  });

  it("should call the third argument with the second argument", () => {
    const directiveName = "dummy-directive";
    const values = ["1", "2", "3"];
    createDirectiveValue(directiveName, values, arrayWrapperMock);

    expect(arrayWrapperMock).toBeCalledWith(values);
  });
});

describe("convertFetchDirectiveToString", () => {
  context("when giving undefined", () => {
    it("should return an empty string", () => {
      expect(convertFetchDirectiveToString()).toBe("");
    });
  });

  context("when giving an empty object", () => {
    it("should return an empty string", () => {
      expect(convertFetchDirectiveToString({})).toBe("");
    });
  });

  context('when giving an object which has "childSrc" property', () => {
    it('should return value which includes "child-src"', () => {
      expect(convertFetchDirectiveToString({ childSrc: "'self'" })).toBe("child-src 'self'");
      expect(convertFetchDirectiveToString({ childSrc: ["'self'", "https://www.example.com/"] })).toBe(
        "child-src 'self' https://www.example.com/",
      );
    });
  });

  context('when giving an object which has "connectSrc" property', () => {
    it('should return value which includes "connect-src"', () => {
      expect(convertFetchDirectiveToString({ connectSrc: "'self'" })).toBe("connect-src 'self'");
      expect(convertFetchDirectiveToString({ connectSrc: ["'self'", "https://www.example.com/"] })).toBe(
        "connect-src 'self' https://www.example.com/",
      );
    });
  });

  context('when giving an object which has "defaultSrc" property', () => {
    it('should return value which includes "default-src"', () => {
      expect(convertFetchDirectiveToString({ defaultSrc: "'self'" })).toBe("default-src 'self'");
      expect(convertFetchDirectiveToString({ defaultSrc: ["'self'", "https://www.example.com/"] })).toBe(
        "default-src 'self' https://www.example.com/",
      );
    });
  });

  context('when giving an object which has "fontSrc" property', () => {
    it('should return value which includes "font-src"', () => {
      expect(convertFetchDirectiveToString({ fontSrc: "'self'" })).toBe("font-src 'self'");
      expect(convertFetchDirectiveToString({ fontSrc: ["'self'", "https://www.example.com/"] })).toBe(
        "font-src 'self' https://www.example.com/",
      );
    });
  });

  context('when giving an object which has "frameSrc" property', () => {
    it('should return value which includes "frame-src"', () => {
      expect(convertFetchDirectiveToString({ frameSrc: "'self'" })).toBe("frame-src 'self'");
      expect(convertFetchDirectiveToString({ frameSrc: ["'self'", "https://www.example.com/"] })).toBe(
        "frame-src 'self' https://www.example.com/",
      );
    });
  });

  context('when giving an object which has "imgSrc" property', () => {
    it('should return value which includes "img-src"', () => {
      expect(convertFetchDirectiveToString({ imgSrc: "'self'" })).toBe("img-src 'self'");
      expect(convertFetchDirectiveToString({ imgSrc: ["'self'", "https://www.example.com/"] })).toBe(
        "img-src 'self' https://www.example.com/",
      );
    });
  });

  context('when giving an object which has "manifestSrc" property', () => {
    it('should return value which includes "manifest-src"', () => {
      expect(convertFetchDirectiveToString({ manifestSrc: "'self'" })).toBe("manifest-src 'self'");
      expect(convertFetchDirectiveToString({ manifestSrc: ["'self'", "https://www.example.com/"] })).toBe(
        "manifest-src 'self' https://www.example.com/",
      );
    });
  });

  context('when giving an object which has "mediaSrc" property', () => {
    it('should return value which includes "media-src"', () => {
      expect(convertFetchDirectiveToString({ mediaSrc: "'self'" })).toBe("media-src 'self'");
      expect(convertFetchDirectiveToString({ mediaSrc: ["'self'", "https://www.example.com/"] })).toBe(
        "media-src 'self' https://www.example.com/",
      );
    });
  });

  context('when giving an object which has "prefetchSrc" property', () => {
    it('should return value which includes "prefetch-src"', () => {
      expect(convertFetchDirectiveToString({ prefetchSrc: "'self'" })).toBe("prefetch-src 'self'");
      expect(convertFetchDirectiveToString({ prefetchSrc: ["'self'", "https://www.example.com/"] })).toBe(
        "prefetch-src 'self' https://www.example.com/",
      );
    });
  });

  context('when giving an object which has "objectSrc" property', () => {
    it('should return value which includes "object-src"', () => {
      expect(convertFetchDirectiveToString({ objectSrc: "'self'" })).toBe("object-src 'self'");
      expect(convertFetchDirectiveToString({ objectSrc: ["'self'", "https://www.example.com/"] })).toBe(
        "object-src 'self' https://www.example.com/",
      );
    });
  });

  context('when giving an object which has "scriptSrc" property', () => {
    it('should return value which includes "script-src"', () => {
      expect(convertFetchDirectiveToString({ scriptSrc: "'self'" })).toBe("script-src 'self'");
      expect(convertFetchDirectiveToString({ scriptSrc: ["'self'", "https://www.example.com/"] })).toBe(
        "script-src 'self' https://www.example.com/",
      );
    });
  });

  context('when giving an object which has "scriptSrcElem" property', () => {
    it('should return value which includes "script-src-elem"', () => {
      expect(convertFetchDirectiveToString({ scriptSrcElem: "'self'" })).toBe("script-src-elem 'self'");
      expect(convertFetchDirectiveToString({ scriptSrcElem: ["'self'", "https://www.example.com/"] })).toBe(
        "script-src-elem 'self' https://www.example.com/",
      );
    });
  });

  context('when giving an object which has "scriptSrcAttr" property', () => {
    it('should return value which includes "script-src-attr"', () => {
      expect(convertFetchDirectiveToString({ scriptSrcAttr: "'self'" })).toBe("script-src-attr 'self'");
      expect(convertFetchDirectiveToString({ scriptSrcAttr: ["'self'", "https://www.example.com/"] })).toBe(
        "script-src-attr 'self' https://www.example.com/",
      );
    });
  });

  context('when giving an object which has "styleSrc" property', () => {
    it('should return value which includes "style-src"', () => {
      expect(convertFetchDirectiveToString({ styleSrc: "'self'" })).toBe("style-src 'self'");
      expect(convertFetchDirectiveToString({ styleSrc: ["'self'", "https://www.example.com/"] })).toBe(
        "style-src 'self' https://www.example.com/",
      );
    });
  });

  context('when giving an object which has "styleSrcElem" property', () => {
    it('should return value which includes "style-src-elem"', () => {
      expect(convertFetchDirectiveToString({ styleSrcElem: "'self'" })).toBe("style-src-elem 'self'");
      expect(convertFetchDirectiveToString({ styleSrcElem: ["'self'", "https://www.example.com/"] })).toBe(
        "style-src-elem 'self' https://www.example.com/",
      );
    });
  });

  context('when giving an object which has "styleSrcAttr" property', () => {
    it('should return value which includes "style-src-attr"', () => {
      expect(convertFetchDirectiveToString({ styleSrcAttr: "'self'" })).toBe("style-src-attr 'self'");
      expect(convertFetchDirectiveToString({ styleSrcAttr: ["'self'", "https://www.example.com/"] })).toBe(
        "style-src-attr 'self' https://www.example.com/",
      );
    });
  });

  context('when giving an object which has "workerSrc" property', () => {
    it('should return value which includes "worker-src"', () => {
      expect(convertFetchDirectiveToString({ workerSrc: "'self'" })).toBe("worker-src 'self'");
      expect(convertFetchDirectiveToString({ workerSrc: ["'self'", "https://www.example.com/"] })).toBe(
        "worker-src 'self' https://www.example.com/",
      );
    });
  });

  context("when giving an object which has undefined", () => {
    it("should ignore the properties", () => {
      expect(convertFetchDirectiveToString({ childSrc: undefined, objectSrc: undefined, styleSrc: "'self'" })).toBe(
        "style-src 'self'",
      );
    });
  });

  context("when giving an object which has one or more properties", () => {
    it('should return value which includes their directive names joined "; "', () => {
      expect(
        convertFetchDirectiveToString({
          childSrc: "'self'",
          objectSrc: "https://example.com/",
          styleSrc: "'unsafe-inline'",
        }),
      ).toBe("child-src 'self'; object-src https://example.com/; style-src 'unsafe-inline'");
    });
  });
});

describe("convertDocumentDirectiveToString", () => {
  context("when giving undefined", () => {
    it("should return an empty string", () => {
      expect(convertDocumentDirectiveToString()).toBe("");
    });
  });

  context("when giving an empty object", () => {
    it("should return an empty string", () => {
      expect(convertDocumentDirectiveToString({})).toBe("");
    });
  });

  context('when giving an object which has "baseURI" property', () => {
    it('should return value which includes "base-uri"', () => {
      expect(convertDocumentDirectiveToString({ baseURI: "'self'" })).toBe("base-uri 'self'");
      expect(convertDocumentDirectiveToString({ baseURI: ["'self'", "https://www.example.com/"] })).toBe(
        "base-uri 'self' https://www.example.com/",
      );
    });
  });

  context('when giving an object which has "pluginTypes" property', () => {
    it('should return value which includes "plugin-types"', () => {
      expect(convertDocumentDirectiveToString({ pluginTypes: "text/javascript" })).toBe("plugin-types text/javascript");
      expect(convertDocumentDirectiveToString({ pluginTypes: ["text/javascript", "image/png"] })).toBe(
        "plugin-types text/javascript image/png",
      );
    });
  });

  context('when giving an object which has "sandbox" property', () => {
    it('should return value which includes "sandbox"', () => {
      expect(convertDocumentDirectiveToString({ sandbox: true })).toBe("sandbox");
      expect(convertDocumentDirectiveToString({ sandbox: "allow-forms" })).toBe("sandbox allow-forms");
    });
  });

  context("when giving an object which has one or more properties", () => {
    it('should return value which includes their directive names joined "; "', () => {
      expect(
        convertDocumentDirectiveToString({
          baseURI: "'self'",
          pluginTypes: ["text/javascript", "image/png"],
          sandbox: true,
        }),
      ).toBe("base-uri 'self'; plugin-types text/javascript image/png; sandbox");
    });
  });
});

describe("convertReportingDirectiveToString", () => {
  context("when giving undefined", () => {
    it("should return an empty string", () => {
      expect(convertReportingDirectiveToString()).toBe("");
    });
  });

  context("when giving an empty object", () => {
    it("should return an empty string", () => {
      expect(convertReportingDirectiveToString({})).toBe("");
    });
  });

  context('when giving an object which has "navigateTo" property', () => {
    it('should return value which includes "navigate-to"', () => {
      expect(convertReportingDirectiveToString({ navigateTo: "'self'" })).toBe("navigate-to 'self'");
      expect(convertReportingDirectiveToString({ navigateTo: ["'self'", "https://example.com/"] })).toBe(
        "navigate-to 'self' https://example.com/",
      );
    });
  });

  context('when giving an object which has "reportURI" property', () => {
    it('should return value which includes "report-uri"', () => {
      expect(convertReportingDirectiveToString({ reportURI: "https://example.com" })).toBe("report-uri https://example.com/");
      expect(
        convertReportingDirectiveToString({ reportURI: ["https://example.com", new URL("https://www.example.com")] }),
      ).toBe("report-uri https://example.com/ https://www.example.com/");
    });
  });

  context('when giving an object which has "reportTo" property', () => {
    it('should return value which includes "report-to"', () => {
      expect(convertReportingDirectiveToString({ reportTo: "endpoint-1" })).toBe("report-to endpoint-1");
    });
  });

  context("when giving an object which has one or more properties", () => {
    it('should return value which includes their directive names joined "; "', () => {
      expect(
        convertReportingDirectiveToString({
          navigateTo: "'self'",
          reportURI: new URL("https://example.com"),
          reportTo: "endpoint-1",
        }),
      ).toBe("navigate-to 'self'; report-uri https://example.com/; report-to endpoint-1");
    });
  });
});
