import { encodeStrictURI } from "./shared";
import { createExpectCTHeader, createExpectCTHeaderValue } from "./expect-ct";

describe("createExpectCTHeader", () => {
  let headerValueCreatorMock: jest.Mock<
    ReturnType<typeof createExpectCTHeaderValue>,
    Parameters<typeof createExpectCTHeaderValue>
  >;
  beforeAll(() => {
    headerValueCreatorMock = jest.fn(createExpectCTHeaderValue);
  });

  it('should return "Expect-CT" as object\'s "name" property', () => {
    expect(createExpectCTHeader(undefined, headerValueCreatorMock)).toHaveProperty("name", "Expect-CT");
  });

  it('should call the second argument function and return a value from the function as object\'s "value" property', () => {
    const dummyOption: Parameters<typeof createExpectCTHeader>[0] = undefined;
    const dummyValue = "dummy-value";
    headerValueCreatorMock.mockReturnValue(dummyValue);

    expect(createExpectCTHeader(dummyOption, headerValueCreatorMock)).toHaveProperty("value", dummyValue);
    expect(headerValueCreatorMock).toBeCalledWith(dummyOption);
  });
});

describe("createExpectCTHeaderValue", () => {
  const secondsOfOneDay = 60 * 60 * 24;

  context("when giving undefined", () => {
    it("should return undefined", () => {
      expect(createExpectCTHeaderValue()).toBeUndefined();
      expect(createExpectCTHeaderValue(null as any)).toBeUndefined();
    });
  });

  context("when giving false", () => {
    it("should return undefined", () => {
      expect(createExpectCTHeaderValue(false)).toBeUndefined();
    });
  });

  context("when giving true", () => {
    it('should return "max-age" set one day', () => {
      expect(createExpectCTHeaderValue(true)).toBe(`max-age=${secondsOfOneDay}`);
    });
  });

  context("when giving an array without any options", () => {
    context("giving false in the first element", () => {
      it("should raise error", () => {
        expect(() => createExpectCTHeaderValue([false as any, {}])).toThrow();
      });
    });

    context("giving true in the first element", () => {
      it('should return "max-age" set one day', () => {
        expect(createExpectCTHeaderValue([true, {}])).toBe(`max-age=${secondsOfOneDay}`);
      });
    });
  });

  context('when specifying "maxAge" option', () => {
    context("the number is valid", () => {
      it('should return "max-age" set the number', () => {
        const dummyAge = 123;
        expect(createExpectCTHeaderValue([true, { maxAge: dummyAge }])).toBe(`max-age=${dummyAge}`);
      });
    });

    context("the number is invalid", () => {
      it("should raise error", () => {
        expect(() => createExpectCTHeaderValue([true, { maxAge: NaN }])).toThrow();
        expect(() => createExpectCTHeaderValue([true, { maxAge: Number.POSITIVE_INFINITY }])).toThrow();
      });
    });
  });

  context('when specifying "enforce" option', () => {
    context("the option is false", () => {
      it('should return only "max-age"', () => {
        expect(createExpectCTHeaderValue([true, { enforce: false }])).toBe(`max-age=${secondsOfOneDay}`);
      });
    });

    context("the option is true", () => {
      it('should return "max-age" and "enforce"', () => {
        expect(createExpectCTHeaderValue([true, { enforce: true }])).toBe(`max-age=${secondsOfOneDay}, enforce`);
      });
    });
  });

  context('when specifying "reportURI" option', () => {
    let strictURIEncoderMock: jest.Mock<ReturnType<typeof encodeStrictURI>, Parameters<typeof encodeStrictURI>>;
    beforeAll(() => {
      strictURIEncoderMock = jest.fn(encodeStrictURI);
    });

    it("should call the second argument", () => {
      const uri = "https://example.com/";
      createExpectCTHeaderValue([true, { reportURI: uri }], strictURIEncoderMock);

      expect(strictURIEncoderMock).toBeCalledWith(uri);
    });

    it('should return "max-age" and the URI"', () => {
      const uri = "https://example.com/";
      expect(createExpectCTHeaderValue([true, { reportURI: uri }])).toBe(`max-age=${secondsOfOneDay}, report-uri=${uri}`);
    });
  });

  context("when specifying all options", () => {
    context("the options are negative values", () => {
      it('should return only "max-age"', () => {
        expect(createExpectCTHeaderValue([true, { maxAge: undefined, enforce: false, reportURI: undefined }])).toBe(
          `max-age=${secondsOfOneDay}`,
        );
      });
    });

    context("the options are positive values", () => {
      it('should return "max-age" and the options', () => {
        const dummyAge = 123;
        expect(createExpectCTHeaderValue([true, { maxAge: dummyAge, enforce: true, reportURI: "https://example.com" }])).toBe(
          `max-age=${dummyAge}, enforce, report-uri=https://example.com/`,
        );
      });
    });
  });

  context("when giving invalid value", () => {
    it("should raise error", () => {
      expect(() => createExpectCTHeaderValue("foo" as any)).toThrow();
      expect(() => createExpectCTHeaderValue([] as any)).toThrow();
    });
  });
});
