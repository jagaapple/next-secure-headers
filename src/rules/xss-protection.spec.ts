import { createXSSProtectionHeader, createXXSSProtectionHeaderValue } from "./xss-protection";

describe("createXSSProtectionHeader", () => {
  let headerValueCreatorSpy: jest.Mock<
    ReturnType<typeof createXXSSProtectionHeaderValue>,
    Parameters<typeof createXXSSProtectionHeaderValue>
  >;
  beforeAll(() => {
    headerValueCreatorSpy = jest.fn(createXXSSProtectionHeaderValue);
  });

  it('should return "X-XSS-Protection" as object\'s "name" property', () => {
    expect(createXSSProtectionHeader(undefined, headerValueCreatorSpy)).toHaveProperty("name", "X-XSS-Protection");
  });

  it('should call the second argument function and return a value from the function as object\'s "value" property', () => {
    const dummyValue = "dummy-value";
    headerValueCreatorSpy.mockReturnValue(dummyValue);

    expect(createXSSProtectionHeader(undefined, headerValueCreatorSpy)).toHaveProperty("value", dummyValue);
    expect(headerValueCreatorSpy).toBeCalledTimes(1);
  });
});

describe("createXXSSProtectionHeaderValue", () => {
  context("when giving undefined", () => {
    it('should return "1"', () => {
      expect(createXXSSProtectionHeaderValue()).toBe("1");
      expect(createXXSSProtectionHeaderValue(null as any)).toBe("1");
    });
  });

  context("when giving false", () => {
    it('should return "0"', () => {
      expect(createXXSSProtectionHeaderValue(false)).toBe("0");
    });
  });

  context('when giving "sanitize"', () => {
    it('should return "1"', () => {
      expect(createXXSSProtectionHeaderValue("sanitize")).toBe("1");
    });
  });

  context('when giving "block-rendering"', () => {
    it('should return "0; mode=block"', () => {
      expect(createXXSSProtectionHeaderValue("block-rendering")).toBe("1; mode=block");
    });
  });

  context('when giving "report" as array', () => {
    context('"uri" option is string', () => {
      context('"uri" option is valid URI', () => {
        it('should return "1; report=" string and escaped URI', () => {
          expect(createXXSSProtectionHeaderValue(["report", { uri: "https://example.com" }])).toBe(
            "1; report=https://example.com/",
          );
          expect(createXXSSProtectionHeaderValue(["report", { uri: "https://example.com/" }])).toBe(
            "1; report=https://example.com/",
          );
          expect(createXXSSProtectionHeaderValue(["report", { uri: "https://example.com/foo-bar" }])).toBe(
            "1; report=https://example.com/foo-bar",
          );
          expect(createXXSSProtectionHeaderValue(["report", { uri: "https://example.com/foo-bar/" }])).toBe(
            "1; report=https://example.com/foo-bar/",
          );
          expect(createXXSSProtectionHeaderValue(["report", { uri: "https://日本語.com" }])).toBe(
            "1; report=https://xn--wgv71a119e.com/",
          );
          expect(createXXSSProtectionHeaderValue(["report", { uri: "https://日本語.com/" }])).toBe(
            "1; report=https://xn--wgv71a119e.com/",
          );
          expect(createXXSSProtectionHeaderValue(["report", { uri: "https://日本語.com/ほげ" }])).toBe(
            "1; report=https://xn--wgv71a119e.com/%E3%81%BB%E3%81%92",
          );
          expect(createXXSSProtectionHeaderValue(["report", { uri: "https://日本語.com/ほげ/" }])).toBe(
            "1; report=https://xn--wgv71a119e.com/%E3%81%BB%E3%81%92/",
          );
        });
      });

      context('"uri" option is invalid URI', () => {
        it("should raise error", () => {
          expect(() => createXXSSProtectionHeaderValue(["report", { uri: "example.com" }])).toThrow();
          expect(() => createXXSSProtectionHeaderValue(["report", { uri: "foo-bar" }])).toThrow();
          expect(() => createXXSSProtectionHeaderValue(["report", { uri: "ふがほげ" }])).toThrow();
        });
      });
    });

    context('"uri" option is URL object', () => {
      it("should convert to string and return", () => {
        expect(createXXSSProtectionHeaderValue(["report", { uri: new URL("https://example.com") }])).toBe(
          "1; report=https://example.com/",
        );
        expect(createXXSSProtectionHeaderValue(["report", { uri: new URL("https://example.com/") }])).toBe(
          "1; report=https://example.com/",
        );
        expect(createXXSSProtectionHeaderValue(["report", { uri: new URL("https://example.com/foo-bar") }])).toBe(
          "1; report=https://example.com/foo-bar",
        );
        expect(createXXSSProtectionHeaderValue(["report", { uri: new URL("https://example.com/foo-bar/") }])).toBe(
          "1; report=https://example.com/foo-bar/",
        );
        expect(createXXSSProtectionHeaderValue(["report", { uri: new URL("https://日本語.com") }])).toBe(
          "1; report=https://xn--wgv71a119e.com/",
        );
        expect(createXXSSProtectionHeaderValue(["report", { uri: new URL("https://日本語.com/") }])).toBe(
          "1; report=https://xn--wgv71a119e.com/",
        );
        expect(createXXSSProtectionHeaderValue(["report", { uri: new URL("https://日本語.com/ほげ") }])).toBe(
          "1; report=https://xn--wgv71a119e.com/%E3%81%BB%E3%81%92",
        );
        expect(createXXSSProtectionHeaderValue(["report", { uri: new URL("https://日本語.com/ほげ/") }])).toBe(
          "1; report=https://xn--wgv71a119e.com/%E3%81%BB%E3%81%92/",
        );
      });
    });
  });

  context("when giving invalid value", () => {
    it("should raise error", () => {
      expect(() => createXXSSProtectionHeaderValue(true as any)).toThrow();
      expect(() => createXXSSProtectionHeaderValue("foo" as any)).toThrow();
      expect(() => createXXSSProtectionHeaderValue([] as any)).toThrow();
    });
  });
});
