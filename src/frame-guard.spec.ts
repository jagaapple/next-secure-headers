import { createFrameGuardHeader } from "./frame-guard";

describe("createFrameGuardHeader", () => {
  describe("return.name", () => {
    it('should be "X-Frame-Options"', () => {
      expect(createFrameGuardHeader().name).toBe("X-Frame-Options");
    });
  });

  describe("return.value", () => {
    context("when giving undeifned", () => {
      it('should be "deny"', () => {
        expect(createFrameGuardHeader().value).toBe("deny");
        expect(createFrameGuardHeader(null as any).value).toBe("deny");
      });
    });

    context("when giving false", () => {
      it("should be undefined", () => {
        expect(createFrameGuardHeader(false).value).toBe(undefined);
      });
    });

    context('when giving "deny"', () => {
      it('should be "deny"', () => {
        expect(createFrameGuardHeader("deny").value).toBe("deny");
      });
    });

    context('when giving "sameorigin"', () => {
      it('should be "sameorigin"', () => {
        expect(createFrameGuardHeader("sameorigin").value).toBe("sameorigin");
      });
    });

    context('when giving "allow-from" as array', () => {
      context('"uri" option is string', () => {
        context('"uri" option is valid URI', () => {
          it('should be "allow-from" string and escaped URI', () => {
            expect(createFrameGuardHeader(["allow-from", { uri: "https://example.com" }]).value).toBe(
              "allow-from https://example.com/",
            );
            expect(createFrameGuardHeader(["allow-from", { uri: "https://example.com/" }]).value).toBe(
              "allow-from https://example.com/",
            );
            expect(createFrameGuardHeader(["allow-from", { uri: "https://example.com/foo-bar" }]).value).toBe(
              "allow-from https://example.com/foo-bar",
            );
            expect(createFrameGuardHeader(["allow-from", { uri: "https://example.com/foo-bar/" }]).value).toBe(
              "allow-from https://example.com/foo-bar/",
            );
            expect(createFrameGuardHeader(["allow-from", { uri: "https://日本語.com" }]).value).toBe(
              "allow-from https://xn--wgv71a119e.com/",
            );
            expect(createFrameGuardHeader(["allow-from", { uri: "https://日本語.com/" }]).value).toBe(
              "allow-from https://xn--wgv71a119e.com/",
            );
            expect(createFrameGuardHeader(["allow-from", { uri: "https://日本語.com/ほげ" }]).value).toBe(
              "allow-from https://xn--wgv71a119e.com/%E3%81%BB%E3%81%92",
            );
            expect(createFrameGuardHeader(["allow-from", { uri: "https://日本語.com/ほげ/" }]).value).toBe(
              "allow-from https://xn--wgv71a119e.com/%E3%81%BB%E3%81%92/",
            );
          });
        });

        context('"uri" option is invalid URI', () => {
          it("should raise error", () => {
            expect(() => createFrameGuardHeader(["allow-from", { uri: "example.com" }]).value).toThrow();
            expect(() => createFrameGuardHeader(["allow-from", { uri: "foo-bar" }]).value).toThrow();
            expect(() => createFrameGuardHeader(["allow-from", { uri: "ふがほげ" }]).value).toThrow();
          });
        });
      });

      context('"uri" option is URL object', () => {
        it("should convert to string and return", () => {
          expect(createFrameGuardHeader(["allow-from", { uri: new URL("https://example.com") }]).value).toBe(
            "allow-from https://example.com/",
          );
          expect(createFrameGuardHeader(["allow-from", { uri: new URL("https://example.com/") }]).value).toBe(
            "allow-from https://example.com/",
          );
          expect(createFrameGuardHeader(["allow-from", { uri: new URL("https://example.com/foo-bar") }]).value).toBe(
            "allow-from https://example.com/foo-bar",
          );
          expect(createFrameGuardHeader(["allow-from", { uri: new URL("https://example.com/foo-bar/") }]).value).toBe(
            "allow-from https://example.com/foo-bar/",
          );
          expect(createFrameGuardHeader(["allow-from", { uri: new URL("https://日本語.com") }]).value).toBe(
            "allow-from https://xn--wgv71a119e.com/",
          );
          expect(createFrameGuardHeader(["allow-from", { uri: new URL("https://日本語.com/") }]).value).toBe(
            "allow-from https://xn--wgv71a119e.com/",
          );
          expect(createFrameGuardHeader(["allow-from", { uri: new URL("https://日本語.com/ほげ") }]).value).toBe(
            "allow-from https://xn--wgv71a119e.com/%E3%81%BB%E3%81%92",
          );
          expect(createFrameGuardHeader(["allow-from", { uri: new URL("https://日本語.com/ほげ/") }]).value).toBe(
            "allow-from https://xn--wgv71a119e.com/%E3%81%BB%E3%81%92/",
          );
        });
      });
    });
  });

  context("when giving invalid value", () => {
    it("should raise error", () => {
      expect(() => createFrameGuardHeader(true as any)).toThrow();
      expect(() => createFrameGuardHeader("foo" as any)).toThrow();
      expect(() => createFrameGuardHeader([] as any)).toThrow();
    });
  });
});
