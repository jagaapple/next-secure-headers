import { encodeStrictURI } from "./shared";
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
    let strictURIEncoderSpy: jest.Mock<ReturnType<typeof encodeStrictURI>, Parameters<typeof encodeStrictURI>>;
    beforeAll(() => {
      strictURIEncoderSpy = jest.fn(encodeStrictURI);
    });

    it('should call "encodeStrictURI"', () => {
      const uri = "https://example.com/";
      createXXSSProtectionHeaderValue(["report", { uri }], strictURIEncoderSpy);

      expect(strictURIEncoderSpy).toBeCalledTimes(1);
      expect(strictURIEncoderSpy).toBeCalledWith(uri);
    });

    it('should return "1; report=" and the URI', () => {
      const uri = "https://example.com/";
      expect(createXXSSProtectionHeaderValue(["report", { uri }])).toBe(`1; report=${uri}`);
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
