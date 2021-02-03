import { createFeaturePolicyHeader, createFeaturePolicyHeaderValue, FeaturePolicyOptions } from "./feature-policy";

describe("createFeaturePolicyHeader", () => {
  context("when giving undefined", () => {
    it("should return undefined", () => {
      expect(createFeaturePolicyHeader()).toBeUndefined();
    });
  });

  context("when giving false", () => {
    it("should return undefined", () => {
      expect(createFeaturePolicyHeader(false)).toBeUndefined();
    });
  });

  context("when giving an object", () => {
    const dummyOptions: FeaturePolicyOptions = { "screen-wake-lock": { none: true } };

    let headerValueCreatorMock: jest.Mock<
      ReturnType<typeof createFeaturePolicyHeaderValue>,
      Parameters<typeof createFeaturePolicyHeaderValue>
    >;
    beforeEach(() => {
      headerValueCreatorMock = jest.fn(createFeaturePolicyHeaderValue);
    });

    it('should return "Feature-Policy" as object\'s "name" property', () => {
      expect(createFeaturePolicyHeader(dummyOptions)).toHaveProperty("name", "Feature-Policy");
    });

    it('should call the second argument function and return a value from the function as object\'s "value" property', () => {
      const dummyValue = "dummy-value";
      headerValueCreatorMock.mockReturnValue(dummyValue);

      expect(createFeaturePolicyHeader(dummyOptions, headerValueCreatorMock)).toHaveProperty("value", dummyValue);
      expect(headerValueCreatorMock).toBeCalledWith(dummyOptions);
    });
  });
});

describe("createFeaturePolicyHeaderValue", () => {
  context("when giving undefined", () => {
    it("should return undefined", () => {
      expect(createFeaturePolicyHeaderValue()).toBeUndefined();
      expect(createFeaturePolicyHeaderValue(null as any)).toBeUndefined();
    });
  });

  context("when giving false", () => {
    it("should return undefined", () => {
      expect(createFeaturePolicyHeaderValue(false)).toBeUndefined();
    });
  });

  context("when directive parameters are set to none", () => {
    it("should return the directive with 'none'", () => {
      const options: FeaturePolicyOptions = {
        "screen-wake-lock": { none: true },
      };
      expect(createFeaturePolicyHeaderValue(options)).toBe("screen-wake-lock 'none';");
    });
  });

  context("when directive parameters are set to all", () => {
    it("should return the directive with *", () => {
      const options: FeaturePolicyOptions = {
        "screen-wake-lock": { all: true },
      };
      expect(createFeaturePolicyHeaderValue(options)).toBe("screen-wake-lock *;");
    });
  });

  context("when directive parameters are set to self", () => {
    it("should return the directive with 'self'", () => {
      const options: FeaturePolicyOptions = {
        "screen-wake-lock": { self: true },
      };
      expect(createFeaturePolicyHeaderValue(options)).toBe("screen-wake-lock 'self';");
    });
  });

  context("when directive parameters are set to a single origin", () => {
    it("should return the directive with only the unquoted origin", () => {
      const dummyOrigin = "http://dummy-origin.com";
      const options: FeaturePolicyOptions = {
        "screen-wake-lock": { origins: [dummyOrigin] },
      };
      expect(createFeaturePolicyHeaderValue(options)).toBe(`screen-wake-lock ${dummyOrigin};`);
    });
  });

  context("when directive parameters are set to a list of origins", () => {
    it("should return the directive with the single-spaced origins", () => {
      const dummyOrigins = ["http://dummy-origin1.com", "http://dummy-origin2.com", "http://dummy-origin3.com"];
      const options: FeaturePolicyOptions = {
        "screen-wake-lock": { origins: dummyOrigins },
      };
      expect(createFeaturePolicyHeaderValue(options)).toBe(
        `screen-wake-lock ${dummyOrigins[0]} ${dummyOrigins[1]} ${dummyOrigins[2]};`,
      );
    });
  });

  context("when directive parameters are set to a list of origins", () => {
    it("should return the directive with the single-spaced origins", () => {
      const dummyOrigins = ["http://dummy-origin1.com", "http://dummy-origin2.com", "http://dummy-origin3.com"];
      const options: FeaturePolicyOptions = {
        "screen-wake-lock": { origins: dummyOrigins },
      };
      expect(createFeaturePolicyHeaderValue(options)).toBe(
        `screen-wake-lock ${dummyOrigins[0]} ${dummyOrigins[1]} ${dummyOrigins[2]};`,
      );
    });
  });

  context("when directive parameters are set to self and a list of origins", () => {
    it("should return the directive with 'self' and the single-spaced origins", () => {
      const dummyOrigins = ["http://dummy-origin1.com", "http://dummy-origin2.com", "http://dummy-origin3.com"];
      const options: FeaturePolicyOptions = {
        "screen-wake-lock": { self: true, origins: dummyOrigins },
      };
      expect(createFeaturePolicyHeaderValue(options)).toBe(
        `screen-wake-lock 'self' ${dummyOrigins[0]} ${dummyOrigins[1]} ${dummyOrigins[2]};`,
      );
    });
  });

  context("when directive parameters are conflicting", () => {
    it("should return the parameter of highest priority", () => {
      const options: FeaturePolicyOptions = {
        "screen-wake-lock": { none: true, origins: ["http://dummy-origin.com"] },
      };
      expect(createFeaturePolicyHeaderValue(options)).toBe(`screen-wake-lock 'none';`);
    });
  });

  context("when giving multiple directives with different sets of parameters", () => {
    it('should return "strict-origin-when-cross-origin"', () => {
      const options: FeaturePolicyOptions = {
        // None
        accelerometer: {
          none: true,
        },
        // All
        "ambient-light-sensor": { all: true },
        // Self
        autoplay: { self: true },
        // One origin
        battery: { origins: ["http://dummy-origin.com"] },
        // Multiple origins
        "layout-animations": { origins: ["http://dummy-origin.com", "http://dummy-origin2.com", "http://dummy-origin3.com"] },
        // Self and multiple origins
        "screen-wake-lock": {
          self: true,
          origins: ["http://dummy-origin.com", "http://dummy-origin2.com", "http://dummy-origin3.com"],
        },
        // Conflicting parameters
        vr: { none: true, origins: ["http://dummy-origin.com"] },
      };
      expect(createFeaturePolicyHeaderValue(options)).toBe(
        `accelerometer 'none'; ambient-light-sensor *; autoplay 'self'; battery http://dummy-origin.com; layout-animations http://dummy-origin.com http://dummy-origin2.com http://dummy-origin3.com; screen-wake-lock 'self' http://dummy-origin.com http://dummy-origin2.com http://dummy-origin3.com; vr 'none';`,
      );
    });
  });

  context("when directive parameters are undefined", () => {
    it("should throw an error", () => {
      const wrongOptions: FeaturePolicyOptions = {
        "screen-wake-lock": undefined,
      };
      expect(() => createFeaturePolicyHeaderValue(wrongOptions)).toThrow();
    });
  });

  context("when directive parameters are empty", () => {
    it("should throw an error", () => {
      const wrongOptions: FeaturePolicyOptions = {
        "screen-wake-lock": {},
      };
      expect(() => createFeaturePolicyHeaderValue(wrongOptions)).toThrow();
    });
  });

  context("when options has invalid directives", () => {
    it("should raise an error", () => {
      const wrongOptions = {
        autoplay: { none: true },
        wrongOption: { none: true },
      };
      expect(() => createFeaturePolicyHeaderValue(wrongOptions)).toThrow();
    });
  });
});
