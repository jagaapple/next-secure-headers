import { encodeStrictURI } from "./uri-encoder";

describe("encodeStrictURI", () => {
  context("when giving string", () => {
    it("should encode and return", () => {
      expect(encodeStrictURI("https://example.com")).toBe("https://example.com/");
      expect(encodeStrictURI("https://example.com/")).toBe("https://example.com/");
      expect(encodeStrictURI("https://example.com/foo-bar")).toBe("https://example.com/foo-bar");
      expect(encodeStrictURI("https://example.com/foo-bar/")).toBe("https://example.com/foo-bar/");
      expect(encodeStrictURI("https://日本語.com")).toBe("https://xn--wgv71a119e.com/");
      expect(encodeStrictURI("https://日本語.com/")).toBe("https://xn--wgv71a119e.com/");
      expect(encodeStrictURI("https://日本語.com/ほげ")).toBe("https://xn--wgv71a119e.com/%E3%81%BB%E3%81%92");
      expect(encodeStrictURI("https://日本語.com/ほげ/")).toBe("https://xn--wgv71a119e.com/%E3%81%BB%E3%81%92/");
    });
  });

  context("when giving URL object", () => {
    it("should convert to string", () => {
      expect(encodeStrictURI(new URL("https://example.com"))).toBe("https://example.com/");
      expect(encodeStrictURI(new URL("https://example.com/"))).toBe("https://example.com/");
      expect(encodeStrictURI(new URL("https://example.com/foo-bar"))).toBe("https://example.com/foo-bar");
      expect(encodeStrictURI(new URL("https://example.com/foo-bar/"))).toBe("https://example.com/foo-bar/");
      expect(encodeStrictURI(new URL("https://日本語.com"))).toBe("https://xn--wgv71a119e.com/");
      expect(encodeStrictURI(new URL("https://日本語.com/"))).toBe("https://xn--wgv71a119e.com/");
      expect(encodeStrictURI(new URL("https://日本語.com/ほげ"))).toBe("https://xn--wgv71a119e.com/%E3%81%BB%E3%81%92");
      expect(encodeStrictURI(new URL("https://日本語.com/ほげ/"))).toBe("https://xn--wgv71a119e.com/%E3%81%BB%E3%81%92/");
    });
  });

  context("when giving invalid URI", () => {
    it("should raise error", () => {
      expect(() => encodeStrictURI("example.com")).toThrow();
      expect(() => encodeStrictURI("foo-bar")).toThrow();
      expect(() => encodeStrictURI("ふがほげ")).toThrow();
    });
  });
});
