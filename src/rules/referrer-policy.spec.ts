import { createReferrerPolicyHeader, createReferrerPolicyHeaderValue } from "./referrer-policy";

describe("createReferrerPolicyHeader", () => {
  context("when giving undefined", () => {
    it("should return undefined", () => {
      expect(createReferrerPolicyHeader()).toBeUndefined();
    });
  });

  context("when giving false", () => {
    it("should return undefined", () => {
      expect(createReferrerPolicyHeader(false)).toBeUndefined();
    });
  });

  context("when giving an object", () => {
    const dummyOption: Parameters<typeof createReferrerPolicyHeader>[0] = "same-origin";

    let headerValueCreatorMock: jest.Mock<
      ReturnType<typeof createReferrerPolicyHeaderValue>,
      Parameters<typeof createReferrerPolicyHeaderValue>
    >;
    beforeEach(() => {
      headerValueCreatorMock = jest.fn(createReferrerPolicyHeaderValue);
    });

    it('should return "Referrer-Policy" as object\'s "name" property', () => {
      expect(createReferrerPolicyHeader(dummyOption, headerValueCreatorMock)).toHaveProperty("name", "Referrer-Policy");
    });

    it('should call the second argument function and return a value from the function as object\'s "value" property', () => {
      const dummyValue = "dummy-value";
      headerValueCreatorMock.mockReturnValue(dummyValue);

      expect(createReferrerPolicyHeader(dummyOption, headerValueCreatorMock)).toHaveProperty("value", dummyValue);
      expect(headerValueCreatorMock).toBeCalledWith(dummyOption);
    });
  });
});

describe("createReferrerPolicyHeaderValue", () => {
  context("when giving undefined", () => {
    it("should return undefined", () => {
      expect(createReferrerPolicyHeaderValue()).toBeUndefined();
      expect(createReferrerPolicyHeaderValue(null as any)).toBeUndefined();
    });
  });

  context("when giving false", () => {
    it("should return undefined", () => {
      expect(createReferrerPolicyHeaderValue(false)).toBeUndefined();
    });
  });

  context('when giving "no-referrer"', () => {
    it('should return "no-referrer"', () => {
      expect(createReferrerPolicyHeaderValue("no-referrer")).toBe("no-referrer");
    });
  });

  context('when giving "no-referrer-when-downgrade"', () => {
    it('should return "no-referrer-when-downgrade"', () => {
      expect(createReferrerPolicyHeaderValue("no-referrer-when-downgrade")).toBe("no-referrer-when-downgrade");
    });
  });

  context('when giving "origin"', () => {
    it('should return "origin"', () => {
      expect(createReferrerPolicyHeaderValue("origin")).toBe("origin");
    });
  });

  context('when giving "origin-when-cross-origin"', () => {
    it('should return "origin-when-cross-origin"', () => {
      expect(createReferrerPolicyHeaderValue("origin-when-cross-origin")).toBe("origin-when-cross-origin");
    });
  });

  context('when giving "same-origin"', () => {
    it('should return "same-origin"', () => {
      expect(createReferrerPolicyHeaderValue("same-origin")).toBe("same-origin");
    });
  });

  context('when giving "strict-origin"', () => {
    it('should return "strict-origin"', () => {
      expect(createReferrerPolicyHeaderValue("strict-origin")).toBe("strict-origin");
    });
  });

  context('when giving "strict-origin-when-cross-origin"', () => {
    it('should return "strict-origin-when-cross-origin"', () => {
      expect(createReferrerPolicyHeaderValue("strict-origin-when-cross-origin")).toBe("strict-origin-when-cross-origin");
    });
  });

  context('when giving "unsafe-url"', () => {
    it("should raise error", () => {
      expect(() => createReferrerPolicyHeaderValue("unsafe-url" as any)).toThrow();
    });
  });

  context("when giving an array", () => {
    context("the array has one value", () => {
      it("should return the value", () => {
        expect(createReferrerPolicyHeaderValue(["no-referrer"])).toBe("no-referrer");
      });
    });

    context("the array has two or more values", () => {
      it("should join them using comma and return it as string", () => {
        expect(createReferrerPolicyHeaderValue(["no-referrer", "origin", "strict-origin-when-cross-origin"])).toBe(
          "no-referrer, origin, strict-origin-when-cross-origin",
        );
      });
    });

    context("the array has invalid values", () => {
      it("should raise error", () => {
        expect(() => createReferrerPolicyHeaderValue(["no-referrer", "foo" as any, "origin-when-cross-origin"])).toThrow();
      });
    });

    context("the array has dangerous values", () => {
      it("should raise error", () => {
        expect(() =>
          createReferrerPolicyHeaderValue(["no-referrer", "unsafe-url" as any, "origin-when-cross-origin"]),
        ).toThrow();
      });
    });
  });
});
