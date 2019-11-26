import { createHSTSHeaderValue, createForceHTTPSRedirectHeader } from "./force-https-redirect";

describe("createForceHTTPSRedirectHeader", () => {
  let headerValueCreatorSpy: jest.Mock<ReturnType<typeof createHSTSHeaderValue>, Parameters<typeof createHSTSHeaderValue>>;
  beforeAll(() => {
    headerValueCreatorSpy = jest.fn(createHSTSHeaderValue);
  });

  it('should return "Strict-Transport-Security" as object\'s "name" property', () => {
    expect(createForceHTTPSRedirectHeader(undefined, headerValueCreatorSpy)).toHaveProperty(
      "name",
      "Strict-Transport-Security",
    );
  });

  it('should call the second argument function and return a value from the function as object\'s "value" property', () => {
    const dummyValue = "dummy-value";
    headerValueCreatorSpy.mockReturnValue(dummyValue);

    expect(createForceHTTPSRedirectHeader(undefined, headerValueCreatorSpy)).toHaveProperty("value", dummyValue);
    expect(headerValueCreatorSpy).toBeCalledTimes(1);
  });
});

describe("createHSTSHeaderValue", () => {
  const secondsOfTwoYears = 60 * 60 * 24 * 365 * 2;

  context("when giving undefined", () => {
    it('should return "max-age=" set two years', () => {
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
    it('should return "max-age=" set two years', () => {
      expect(createHSTSHeaderValue(true)).toBe(`max-age=${secondsOfTwoYears}`);
    });
  });

  context("when giving false as array", () => {
    it("should raise error", () => {
      expect(() => createHSTSHeaderValue([false as any])).toThrowError();
    });
  });

  context("when giving true as array", () => {
    it('should return "max-age=" set two years', () => {
      expect(createHSTSHeaderValue([true])).toBe(`max-age=${secondsOfTwoYears}`);
    });
  });

  context("when giving a number as array", () => {
    it('should return "max-age=" set the number', () => {
      const dummyAge = 123;
      expect(createHSTSHeaderValue([dummyAge])).toBe(`max-age=${dummyAge}`);
    });
  });

  context("when giving an invalid number as array", () => {
    it("should raise error", () => {
      expect(() => createHSTSHeaderValue([NaN])).toThrow();
      expect(() => createHSTSHeaderValue([Number.POSITIVE_INFINITY])).toThrow();
      expect(() => createHSTSHeaderValue([Number.NEGATIVE_INFINITY])).toThrow();
    });
  });

  context('when specifying "includeSubDomains" option', () => {
    context('specifying false to "includeSubDomains"', () => {
      it('should return only "max-age"', () => {
        expect(createHSTSHeaderValue([true, { includeSubDomains: false }])).toBe(`max-age=${secondsOfTwoYears}`);

        const dummyAge = 123;
        expect(createHSTSHeaderValue([dummyAge, { includeSubDomains: false }])).toBe(`max-age=${dummyAge}`);
      });
    });

    context('specifying true to "includeSubDomains"', () => {
      it('should return "max-age" and "includeSubDomains"', () => {
        expect(createHSTSHeaderValue([true, { includeSubDomains: true }])).toBe(
          `max-age=${secondsOfTwoYears}; includeSubDomains`,
        );

        const dummyAge = 123;
        expect(createHSTSHeaderValue([dummyAge, { includeSubDomains: true }])).toBe(`max-age=${dummyAge}; includeSubDomains`);
      });
    });
  });

  context('when specifying "preload" option', () => {
    context('specifying false to "preload"', () => {
      it('should return only "max-age"', () => {
        expect(createHSTSHeaderValue([true, { preload: false }])).toBe(`max-age=${secondsOfTwoYears}`);

        const dummyAge = 123;
        expect(createHSTSHeaderValue([dummyAge, { preload: false }])).toBe(`max-age=${dummyAge}`);
      });
    });

    context('specifying true to "preload"', () => {
      it('should return "max-age" and "preload"', () => {
        expect(createHSTSHeaderValue([true, { preload: true }])).toBe(`max-age=${secondsOfTwoYears}; preload`);

        const dummyAge = 123;
        expect(createHSTSHeaderValue([dummyAge, { preload: true }])).toBe(`max-age=${dummyAge}; preload`);
      });
    });
  });

  context("when specifying all options", () => {
    context("specifying false to the options", () => {
      it('should return only "max-age"', () => {
        expect(createHSTSHeaderValue([true, { includeSubDomains: false, preload: false }])).toBe(
          `max-age=${secondsOfTwoYears}`,
        );

        const dummyAge = 123;
        expect(createHSTSHeaderValue([dummyAge, { includeSubDomains: false, preload: false }])).toBe(`max-age=${dummyAge}`);
      });
    });

    context("specifying true to the options", () => {
      it('should return "max-age" and the options', () => {
        expect(createHSTSHeaderValue([true, { includeSubDomains: true, preload: true }])).toBe(
          `max-age=${secondsOfTwoYears}; includeSubDomains; preload`,
        );

        const dummyAge = 123;
        expect(createHSTSHeaderValue([dummyAge, { includeSubDomains: true, preload: true }])).toBe(
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
