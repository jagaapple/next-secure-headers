import { createNoopenHeader, createXDownloadOptionsHeaderValue } from "./noopen";

describe("createNoopenHeader", () => {
  let headerValueCreatorSpy: jest.Mock<
    ReturnType<typeof createXDownloadOptionsHeaderValue>,
    Parameters<typeof createXDownloadOptionsHeaderValue>
  >;
  beforeAll(() => {
    headerValueCreatorSpy = jest.fn(createXDownloadOptionsHeaderValue);
  });

  it('should return "X-Download-Options" as object\'s "name" property', () => {
    expect(createNoopenHeader(undefined, headerValueCreatorSpy)).toHaveProperty("name", "X-Download-Options");
  });

  it('should call the second argument function and return a value from the function as object\'s "value" property', () => {
    const dummyValue = "dummy-value";
    headerValueCreatorSpy.mockReturnValue(dummyValue);

    expect(createNoopenHeader(undefined, headerValueCreatorSpy)).toHaveProperty("value", dummyValue);
    expect(headerValueCreatorSpy).toBeCalledTimes(1);
  });
});

describe("createXDownloadOptionsHeaderValue", () => {
  context("when giving undefined", () => {
    it('should return "noopen"', () => {
      expect(createXDownloadOptionsHeaderValue()).toBe("noopen");
      expect(createXDownloadOptionsHeaderValue(null as any)).toBe("noopen");
    });
  });

  context("when giving false", () => {
    it("should return undefined", () => {
      expect(createXDownloadOptionsHeaderValue(false)).toBeUndefined();
    });
  });

  context('when giving "noopen"', () => {
    it('should return "noopen"', () => {
      expect(createXDownloadOptionsHeaderValue("noopen")).toBe("noopen");
    });
  });

  context("when giving invalid value", () => {
    it("should raise error", () => {
      expect(() => createXDownloadOptionsHeaderValue(true as any)).toThrow();
      expect(() => createXDownloadOptionsHeaderValue("foo" as any)).toThrow();
      expect(() => createXDownloadOptionsHeaderValue([] as any)).toThrow();
    });
  });
});
