import { createFrameGuardHeader, createXFrameOptionsHeaderValue } from "./frame-guard";

describe("createFrameGuardHeader", () => {
  let headerValueCreatorSpy: jest.Mock<
    ReturnType<typeof createXFrameOptionsHeaderValue>,
    Parameters<typeof createXFrameOptionsHeaderValue>
  >;
  beforeAll(() => {
    headerValueCreatorSpy = jest.fn(createXFrameOptionsHeaderValue);
  });

  it('should return "X-Frame-Options" as object\'s "name" property', () => {
    expect(createFrameGuardHeader(undefined, headerValueCreatorSpy)).toHaveProperty("name", "X-Frame-Options");
  });

  it('should call the second argument function and return a value from the function as object\'s "value" property', () => {
    const dummyValue = "dummy-value";
    headerValueCreatorSpy.mockReturnValue(dummyValue);

    expect(createFrameGuardHeader(undefined, headerValueCreatorSpy)).toHaveProperty("value", dummyValue);
    expect(headerValueCreatorSpy).toBeCalledTimes(1);
  });
});

describe("createXFrameOptionsHeaderValue", () => {
  context("when giving undeifned", () => {
    it('should return "deny"', () => {
      expect(createXFrameOptionsHeaderValue()).toBe("deny");
      expect(createXFrameOptionsHeaderValue(null as any)).toBe("deny");
    });
  });

  context("when giving false", () => {
    it("should return undefined", () => {
      expect(createXFrameOptionsHeaderValue(false)).toBeUndefined();
    });
  });

  context('when giving "deny"', () => {
    it('should return "deny"', () => {
      expect(createXFrameOptionsHeaderValue("deny")).toBe("deny");
    });
  });

  context('when giving "sameorigin"', () => {
    it('should return "sameorigin"', () => {
      expect(createXFrameOptionsHeaderValue("sameorigin")).toBe("sameorigin");
    });
  });

  context('when giving "allow-from" as array', () => {
    context('"uri" option is string', () => {
      context('"uri" option is valid URI', () => {
        it('should return "allow-from" string and escaped URI', () => {
          expect(createXFrameOptionsHeaderValue(["allow-from", { uri: "https://example.com" }])).toBe(
            "allow-from https://example.com/",
          );
          expect(createXFrameOptionsHeaderValue(["allow-from", { uri: "https://example.com/" }])).toBe(
            "allow-from https://example.com/",
          );
          expect(createXFrameOptionsHeaderValue(["allow-from", { uri: "https://example.com/foo-bar" }])).toBe(
            "allow-from https://example.com/foo-bar",
          );
          expect(createXFrameOptionsHeaderValue(["allow-from", { uri: "https://example.com/foo-bar/" }])).toBe(
            "allow-from https://example.com/foo-bar/",
          );
          expect(createXFrameOptionsHeaderValue(["allow-from", { uri: "https://日本語.com" }])).toBe(
            "allow-from https://xn--wgv71a119e.com/",
          );
          expect(createXFrameOptionsHeaderValue(["allow-from", { uri: "https://日本語.com/" }])).toBe(
            "allow-from https://xn--wgv71a119e.com/",
          );
          expect(createXFrameOptionsHeaderValue(["allow-from", { uri: "https://日本語.com/ほげ" }])).toBe(
            "allow-from https://xn--wgv71a119e.com/%E3%81%BB%E3%81%92",
          );
          expect(createXFrameOptionsHeaderValue(["allow-from", { uri: "https://日本語.com/ほげ/" }])).toBe(
            "allow-from https://xn--wgv71a119e.com/%E3%81%BB%E3%81%92/",
          );
        });
      });

      context('"uri" option is invalid URI', () => {
        it("should raise error", () => {
          expect(() => createXFrameOptionsHeaderValue(["allow-from", { uri: "example.com" }])).toThrow();
          expect(() => createXFrameOptionsHeaderValue(["allow-from", { uri: "foo-bar" }])).toThrow();
          expect(() => createXFrameOptionsHeaderValue(["allow-from", { uri: "ふがほげ" }])).toThrow();
        });
      });
    });

    context('"uri" option is URL object', () => {
      it("should convert to string and return", () => {
        expect(createXFrameOptionsHeaderValue(["allow-from", { uri: new URL("https://example.com") }])).toBe(
          "allow-from https://example.com/",
        );
        expect(createXFrameOptionsHeaderValue(["allow-from", { uri: new URL("https://example.com/") }])).toBe(
          "allow-from https://example.com/",
        );
        expect(createXFrameOptionsHeaderValue(["allow-from", { uri: new URL("https://example.com/foo-bar") }])).toBe(
          "allow-from https://example.com/foo-bar",
        );
        expect(createXFrameOptionsHeaderValue(["allow-from", { uri: new URL("https://example.com/foo-bar/") }])).toBe(
          "allow-from https://example.com/foo-bar/",
        );
        expect(createXFrameOptionsHeaderValue(["allow-from", { uri: new URL("https://日本語.com") }])).toBe(
          "allow-from https://xn--wgv71a119e.com/",
        );
        expect(createXFrameOptionsHeaderValue(["allow-from", { uri: new URL("https://日本語.com/") }])).toBe(
          "allow-from https://xn--wgv71a119e.com/",
        );
        expect(createXFrameOptionsHeaderValue(["allow-from", { uri: new URL("https://日本語.com/ほげ") }])).toBe(
          "allow-from https://xn--wgv71a119e.com/%E3%81%BB%E3%81%92",
        );
        expect(createXFrameOptionsHeaderValue(["allow-from", { uri: new URL("https://日本語.com/ほげ/") }])).toBe(
          "allow-from https://xn--wgv71a119e.com/%E3%81%BB%E3%81%92/",
        );
      });
    });
  });

  context("when giving invalid value", () => {
    it("should raise error", () => {
      expect(() => createXFrameOptionsHeaderValue(true as any)).toThrow();
      expect(() => createXFrameOptionsHeaderValue("foo" as any)).toThrow();
      expect(() => createXFrameOptionsHeaderValue([] as any)).toThrow();
    });
  });
});
