import { createForceHTTPSRedirectHeader } from "./force-https-redirect";

describe("createForceHTTPSRedirectHeader", () => {
  describe("return.name", () => {
    it('should be "Strict-Transport-Security"', () => {
      expect(createForceHTTPSRedirectHeader().name).toBe("Strict-Transport-Security");
    });
  });

  describe("return.value", () => {
    const secondsOfTwoYears = 60 * 60 * 24 * 365 * 2;

    context("when giving undefined", () => {
      it('should be "max-age=" set two years', () => {
        expect(createForceHTTPSRedirectHeader().value).toBe(`max-age=${secondsOfTwoYears}`);
      });
    });

    context("when giving false", () => {
      it("should be undefined", () => {
        expect(createForceHTTPSRedirectHeader(false).value).toBeUndefined();
      });
    });

    context("when giving true", () => {
      it('should be "max-age=" set two years', () => {
        expect(createForceHTTPSRedirectHeader(true).value).toBe(`max-age=${secondsOfTwoYears}`);
      });
    });

    context("when giving false as array", () => {
      it("should raise error", () => {
        expect(() => createForceHTTPSRedirectHeader([false as any]).value).toThrowError();
      });
    });

    context("when giving true as array", () => {
      it('should be "max-age=" set two years', () => {
        expect(createForceHTTPSRedirectHeader([true]).value).toBe(`max-age=${secondsOfTwoYears}`);
      });
    });

    context("when giving a number as array", () => {
      it('should be "max-age=" set the number', () => {
        const dummyAge = 123;
        expect(createForceHTTPSRedirectHeader([dummyAge]).value).toBe(`max-age=${dummyAge}`);
      });
    });

    context("when giving an invalid number as array", () => {
      it("should raise error", () => {
        expect(() => createForceHTTPSRedirectHeader([NaN]).value).toThrow();
        expect(() => createForceHTTPSRedirectHeader([Number.POSITIVE_INFINITY]).value).toThrow();
        expect(() => createForceHTTPSRedirectHeader([Number.NEGATIVE_INFINITY]).value).toThrow();
      });
    });

    context('when specifying "includeSubDomains" option', () => {
      context('specifying false to "includeSubDomains"', () => {
        it('should include only "max-age"', () => {
          expect(createForceHTTPSRedirectHeader([true, { includeSubDomains: false }]).value).toBe(
            `max-age=${secondsOfTwoYears}`,
          );

          const dummyAge = 123;
          expect(createForceHTTPSRedirectHeader([dummyAge, { includeSubDomains: false }]).value).toBe(`max-age=${dummyAge}`);
        });
      });

      context('specifying true to "includeSubDomains"', () => {
        it('should include "max-age" and "includeSubDomains"', () => {
          expect(createForceHTTPSRedirectHeader([true, { includeSubDomains: true }]).value).toBe(
            `max-age=${secondsOfTwoYears}; includeSubDomains`,
          );

          const dummyAge = 123;
          expect(createForceHTTPSRedirectHeader([dummyAge, { includeSubDomains: true }]).value).toBe(
            `max-age=${dummyAge}; includeSubDomains`,
          );
        });
      });
    });

    context('when specifying "preload" option', () => {
      context('specifying false to "preload"', () => {
        it('should include only "max-age"', () => {
          expect(createForceHTTPSRedirectHeader([true, { preload: false }]).value).toBe(`max-age=${secondsOfTwoYears}`);

          const dummyAge = 123;
          expect(createForceHTTPSRedirectHeader([dummyAge, { preload: false }]).value).toBe(`max-age=${dummyAge}`);
        });
      });

      context('specifying true to "preload"', () => {
        it('should include "max-age" and "preload"', () => {
          expect(createForceHTTPSRedirectHeader([true, { preload: true }]).value).toBe(`max-age=${secondsOfTwoYears}; preload`);

          const dummyAge = 123;
          expect(createForceHTTPSRedirectHeader([dummyAge, { preload: true }]).value).toBe(`max-age=${dummyAge}; preload`);
        });
      });
    });

    context("when specifying all options", () => {
      context("specifying false to the options", () => {
        it('should include only "max-age"', () => {
          expect(createForceHTTPSRedirectHeader([true, { includeSubDomains: false, preload: false }]).value).toBe(
            `max-age=${secondsOfTwoYears}`,
          );

          const dummyAge = 123;
          expect(createForceHTTPSRedirectHeader([dummyAge, { includeSubDomains: false, preload: false }]).value).toBe(
            `max-age=${dummyAge}`,
          );
        });
      });

      context("specifying true to the options", () => {
        it('should include "max-age" and the options', () => {
          expect(createForceHTTPSRedirectHeader([true, { includeSubDomains: true, preload: true }]).value).toBe(
            `max-age=${secondsOfTwoYears}; includeSubDomains; preload`,
          );

          const dummyAge = 123;
          expect(createForceHTTPSRedirectHeader([dummyAge, { includeSubDomains: true, preload: true }]).value).toBe(
            `max-age=${dummyAge}; includeSubDomains; preload`,
          );
        });
      });
    });
  });

  context("when giving invalid value", () => {
    it("should raise error", () => {
      expect(() => createForceHTTPSRedirectHeader("foo" as any)).toThrow();
      expect(() => createForceHTTPSRedirectHeader([] as any)).toThrow();
    });
  });
});
