import { createNoopenHeader } from "./noopen";

describe("createNoopenHeader", () => {
  describe("return.name", () => {
    it('should be "X-Download-Options"', () => {
      expect(createNoopenHeader().name).toBe("X-Download-Options");
    });
  });

  describe("return.value", () => {
    context("when giving undefined", () => {
      it('should be "noopen"', () => {
        expect(createNoopenHeader().value).toBe("noopen");
        expect(createNoopenHeader(null as any).value).toBe("noopen");
      });
    });

    context("when giving false", () => {
      it("should be undefined", () => {
        expect(createNoopenHeader(false).value).toBeUndefined();
      });
    });

    context('when giving "noopen"', () => {
      it('should be "noopen"', () => {
        expect(createNoopenHeader("noopen").value).toBe("noopen");
      });
    });
  });

  context("when giving invalid value", () => {
    it("should raise error", () => {
      expect(() => createNoopenHeader(true as any)).toThrow();
      expect(() => createNoopenHeader("foo" as any)).toThrow();
      expect(() => createNoopenHeader([] as any)).toThrow();
    });
  });
});
