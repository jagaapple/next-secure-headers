import { createNosniffHeader, createXContentTypeOptionsHeaderValue } from "./nosniff";

describe("createNosniffHeader", () => {
  let headerValueCreatorMock: jest.Mock<
    ReturnType<typeof createXContentTypeOptionsHeaderValue>,
    Parameters<typeof createXContentTypeOptionsHeaderValue>
  >;
  beforeEach(() => {
    headerValueCreatorMock = jest.fn(createXContentTypeOptionsHeaderValue);
  });

  it('should return "X-Content-Type-Options" as object\'s "name" property', () => {
    expect(createNosniffHeader(undefined, headerValueCreatorMock)).toHaveProperty("name", "X-Content-Type-Options");
  });

  it('should call the second argument function and return a value from the function as object\'s "value" property', () => {
    const dummyOption: Parameters<typeof createNosniffHeader>[0] = undefined;
    const dummyValue = "dummy-value";
    headerValueCreatorMock.mockReturnValue(dummyValue);

    expect(createNosniffHeader(dummyOption, headerValueCreatorMock)).toHaveProperty("value", dummyValue);
    expect(headerValueCreatorMock).toBeCalledWith(dummyOption);
  });
});

describe("createXContentTypeOptionsHeaderValue", () => {
  context("when giving undefined", () => {
    it('should return "nosniff"', () => {
      expect(createXContentTypeOptionsHeaderValue()).toBe("nosniff");
      expect(createXContentTypeOptionsHeaderValue(null as any)).toBe("nosniff");
    });
  });

  context("when giving false", () => {
    it("should return undefined", () => {
      expect(createXContentTypeOptionsHeaderValue(false)).toBeUndefined();
    });
  });

  context('when giving "nosniff"', () => {
    it('should return "nosniff"', () => {
      expect(createXContentTypeOptionsHeaderValue("nosniff")).toBe("nosniff");
    });
  });

  context("when giving invalid value", () => {
    it("should raise error", () => {
      expect(() => createXContentTypeOptionsHeaderValue(true as any)).toThrow();
      expect(() => createXContentTypeOptionsHeaderValue("foo" as any)).toThrow();
      expect(() => createXContentTypeOptionsHeaderValue([] as any)).toThrow();
    });
  });
});
