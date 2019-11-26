import { createNosniffHeader } from "./nosniff";

describe("createNosniffHeader", () => {
  describe("return.name", () => {
    it('should be "X-Content-Type-Options"', () => {
      expect(createNosniffHeader().name).toBe("X-Content-Type-Options");
    });
  });

  describe("return.value", () => {
    context("when giving undefined", () => {
      it('should be "nosniff"', () => {
        expect(createNosniffHeader().value).toBe("nosniff");
        expect(createNosniffHeader(null as any).value).toBe("nosniff");
      });
    });

    context("when giving false", () => {
      it("should be undefined", () => {
        expect(createNosniffHeader(false).value).toBeUndefined();
      });
    });

    context('when giving "nosniff"', () => {
      it('should be "nosniff"', () => {
        expect(createNosniffHeader("nosniff").value).toBe("nosniff");
      });
    });
  });

  context("when giving invalid value", () => {
    it("should raise error", () => {
      expect(() => createNosniffHeader(true as any)).toThrow();
      expect(() => createNosniffHeader("foo" as any)).toThrow();
      expect(() => createNosniffHeader([] as any)).toThrow();
    });
  });
});
