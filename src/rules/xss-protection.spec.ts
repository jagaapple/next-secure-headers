import { createXSSProtectionHeader } from "./xss-protection";

describe("createXSSProtectionHeader", () => {
  describe("return.name", () => {
    it('should be "X-XSS-Protection', () => {
      expect(createXSSProtectionHeader().name).toBe("X-XSS-Protection");
    });
  });

  describe("return.value", () => {
    context("when giving undefined", () => {
      it('should be "1"', () => {
        expect(createXSSProtectionHeader().value).toBe("1");
        expect(createXSSProtectionHeader(null as any).value).toBe("1");
      });
    });

    context("when giving false", () => {
      it('should be "0"', () => {
        expect(createXSSProtectionHeader(false).value).toBe("0");
      });
    });

    context('when giving "sanitize"', () => {
      it('should be "1"', () => {
        expect(createXSSProtectionHeader("sanitize").value).toBe("1");
      });
    });

    context('when giving "block-rendering"', () => {
      it('should be "0; mode=block"', () => {
        expect(createXSSProtectionHeader("block-rendering").value).toBe("1; mode=block");
      });
    });

    context('when giving "report" as array', () => {
      context('"uri" option is string', () => {
        context('"uri" option is valid URI', () => {
          it('should be "1; report=" string and escaped URI', () => {
            expect(createXSSProtectionHeader(["report", { uri: "https://example.com" }]).value).toBe(
              "1; report=https://example.com/",
            );
            expect(createXSSProtectionHeader(["report", { uri: "https://example.com/" }]).value).toBe(
              "1; report=https://example.com/",
            );
            expect(createXSSProtectionHeader(["report", { uri: "https://example.com/foo-bar" }]).value).toBe(
              "1; report=https://example.com/foo-bar",
            );
            expect(createXSSProtectionHeader(["report", { uri: "https://example.com/foo-bar/" }]).value).toBe(
              "1; report=https://example.com/foo-bar/",
            );
            expect(createXSSProtectionHeader(["report", { uri: "https://日本語.com" }]).value).toBe(
              "1; report=https://xn--wgv71a119e.com/",
            );
            expect(createXSSProtectionHeader(["report", { uri: "https://日本語.com/" }]).value).toBe(
              "1; report=https://xn--wgv71a119e.com/",
            );
            expect(createXSSProtectionHeader(["report", { uri: "https://日本語.com/ほげ" }]).value).toBe(
              "1; report=https://xn--wgv71a119e.com/%E3%81%BB%E3%81%92",
            );
            expect(createXSSProtectionHeader(["report", { uri: "https://日本語.com/ほげ/" }]).value).toBe(
              "1; report=https://xn--wgv71a119e.com/%E3%81%BB%E3%81%92/",
            );
          });
        });

        context('"uri" option is invalid URI', () => {
          it("should raise error", () => {
            expect(() => createXSSProtectionHeader(["report", { uri: "example.com" }]).value).toThrow();
            expect(() => createXSSProtectionHeader(["report", { uri: "foo-bar" }]).value).toThrow();
            expect(() => createXSSProtectionHeader(["report", { uri: "ふがほげ" }]).value).toThrow();
          });
        });
      });

      context('"uri" option is URL object', () => {
        it("should convert to string and return", () => {
          expect(createXSSProtectionHeader(["report", { uri: new URL("https://example.com") }]).value).toBe(
            "1; report=https://example.com/",
          );
          expect(createXSSProtectionHeader(["report", { uri: new URL("https://example.com/") }]).value).toBe(
            "1; report=https://example.com/",
          );
          expect(createXSSProtectionHeader(["report", { uri: new URL("https://example.com/foo-bar") }]).value).toBe(
            "1; report=https://example.com/foo-bar",
          );
          expect(createXSSProtectionHeader(["report", { uri: new URL("https://example.com/foo-bar/") }]).value).toBe(
            "1; report=https://example.com/foo-bar/",
          );
          expect(createXSSProtectionHeader(["report", { uri: new URL("https://日本語.com") }]).value).toBe(
            "1; report=https://xn--wgv71a119e.com/",
          );
          expect(createXSSProtectionHeader(["report", { uri: new URL("https://日本語.com/") }]).value).toBe(
            "1; report=https://xn--wgv71a119e.com/",
          );
          expect(createXSSProtectionHeader(["report", { uri: new URL("https://日本語.com/ほげ") }]).value).toBe(
            "1; report=https://xn--wgv71a119e.com/%E3%81%BB%E3%81%92",
          );
          expect(createXSSProtectionHeader(["report", { uri: new URL("https://日本語.com/ほげ/") }]).value).toBe(
            "1; report=https://xn--wgv71a119e.com/%E3%81%BB%E3%81%92/",
          );
        });
      });
    });
  });

  context("when giving invalid value", () => {
    it("should raise error", () => {
      expect(() => createXSSProtectionHeader(true as any)).toThrow();
      expect(() => createXSSProtectionHeader("foo" as any)).toThrow();
      expect(() => createXSSProtectionHeader([] as any)).toThrow();
    });
  });
});
