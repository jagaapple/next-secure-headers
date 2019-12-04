import { createForceHTTPSRedirectHeader, createHSTSHeaderValue } from "./force-https-redirect";

describe("createForceHTTPSRedirectHeader", () => {
  let headerValueCreatorMock: jest.Mock<ReturnType<typeof createHSTSHeaderValue>, Parameters<typeof createHSTSHeaderValue>>;
  beforeAll(() => {
    headerValueCreatorMock = jest.fn(createHSTSHeaderValue);
  });

  it('should return "Strict-Transport-Security" as object\'s "name" property', () => {
    expect(createForceHTTPSRedirectHeader(undefined, headerValueCreatorMock)).toHaveProperty(
      "name",
      "Strict-Transport-Security",
    );
  });

  it('should call the second argument function and return a value from the function as object\'s "value" property', () => {
    const dummyOption: Parameters<typeof createForceHTTPSRedirectHeader>[0] = undefined;
    const dummyValue = "dummy-value";
    headerValueCreatorMock.mockReturnValue(dummyValue);

    expect(createForceHTTPSRedirectHeader(dummyOption, headerValueCreatorMock)).toHaveProperty("value", dummyValue);
    expect(headerValueCreatorMock).toBeCalledWith(dummyOption);
  });
});

describe("createHSTSHeaderValue", () => {
  const secondsOfTwoYears = 60 * 60 * 24 * 365 * 2;

  context("when giving undefined", () => {
    it('should return "max-age" set two years', () => {
      expect(createHSTSHeaderValue()).toBe(`max-age=${secondsOfTwoYears}`);
      expect(createHSTSHeaderValue(null as any)).toBe(`max-age=${secondsOfTwoYears}`);
    });
  });

  context("when giving false", () => {
    it("should return undefined", () => {
      expect(createHSTSHeaderValue(false)).toBeUndefined();
    });
  });

  context("when giving true", () => {
    it('should return "max-age" set two years', () => {
      expect(createHSTSHeaderValue(true)).toBe(`max-age=${secondsOfTwoYears}`);
    });
  });

  context("when giving an array without any options", () => {
    context("giving false in the first element", () => {
      it("should raise error", () => {
        expect(() => createHSTSHeaderValue([false as any, {}])).toThrowError();
      });
    });

    context("giving true in the first element", () => {
      it('should return "max-age" set two years', () => {
        expect(createHSTSHeaderValue([true, {}])).toBe(`max-age=${secondsOfTwoYears}`);
      });
    });
  });

  context('when specifying "maxAge" option', () => {
    context("the number is valid", () => {
      it('should return "max-age" set the number', () => {
        const dummyAge = 123;
        expect(createHSTSHeaderValue([true, { maxAge: dummyAge }])).toBe(`max-age=${dummyAge}`);
      });
    });

    context("the number is invalid", () => {
      it("should raise error", () => {
        expect(() => createHSTSHeaderValue([true, { maxAge: NaN }])).toThrow();
        expect(() => createHSTSHeaderValue([true, { maxAge: Number.POSITIVE_INFINITY }])).toThrow();
      });
    });
  });

  context('when specifying "includeSubDomains" option', () => {
    context("the option is false", () => {
      it('should return only "max-age"', () => {
        expect(createHSTSHeaderValue([true, { includeSubDomains: false }])).toBe(`max-age=${secondsOfTwoYears}`);
      });
    });

    context("the option is true", () => {
      it('should return "max-age" and "includeSubDomains"', () => {
        expect(createHSTSHeaderValue([true, { includeSubDomains: true }])).toBe(
          `max-age=${secondsOfTwoYears}; includeSubDomains`,
        );
      });
    });
  });

  context('when specifying "preload" option', () => {
    context("the option is false", () => {
      it('should return only "max-age"', () => {
        expect(createHSTSHeaderValue([true, { preload: false }])).toBe(`max-age=${secondsOfTwoYears}`);
      });
    });

    context("the option is true", () => {
      it('should return "max-age" and "preload"', () => {
        expect(createHSTSHeaderValue([true, { preload: true }])).toBe(`max-age=${secondsOfTwoYears}; preload`);
      });
    });
  });

  context("when specifying all options", () => {
    context("the options are false", () => {
      it('should return only "max-age"', () => {
        expect(createHSTSHeaderValue([true, { includeSubDomains: false, preload: false }])).toBe(
          `max-age=${secondsOfTwoYears}`,
        );

        const dummyAge = 123;
        expect(createHSTSHeaderValue([true, { maxAge: dummyAge, includeSubDomains: false, preload: false }])).toBe(
          `max-age=${dummyAge}`,
        );
      });
    });

    context("the options are true", () => {
      it('should return "max-age" and the options', () => {
        expect(createHSTSHeaderValue([true, { includeSubDomains: true, preload: true }])).toBe(
          `max-age=${secondsOfTwoYears}; includeSubDomains; preload`,
        );

        const dummyAge = 123;
        expect(createHSTSHeaderValue([true, { maxAge: dummyAge, includeSubDomains: true, preload: true }])).toBe(
          `max-age=${dummyAge}; includeSubDomains; preload`,
        );
      });
    });
  });

  context("when giving invalid value", () => {
    it("should raise error", () => {
      expect(() => createHSTSHeaderValue("foo" as any)).toThrow();
      expect(() => createHSTSHeaderValue([] as any)).toThrow();
    });
  });
});
