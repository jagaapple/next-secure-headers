import { encodeStrictURI } from "./shared";
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
    let strictURIEncoderSpy: jest.Mock<ReturnType<typeof encodeStrictURI>, Parameters<typeof encodeStrictURI>>;
    beforeAll(() => {
      strictURIEncoderSpy = jest.fn(encodeStrictURI);
    });

    it('should call "encodeStrictURI"', () => {
      const uri = "https://example.com/";
      createXFrameOptionsHeaderValue(["allow-from", { uri }], strictURIEncoderSpy);

      expect(strictURIEncoderSpy).toBeCalledTimes(1);
      expect(strictURIEncoderSpy).toBeCalledWith(uri);
    });

    it('should return "allow-from" and the URI', () => {
      const uri = "https://example.com/";
      expect(createXFrameOptionsHeaderValue(["allow-from", { uri }])).toBe(`allow-from ${uri}`);
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
