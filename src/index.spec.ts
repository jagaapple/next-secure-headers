import * as rules from "./rules";
import { createHeadersObject } from "./index";

describe("createHeadersObject", () => {
  let forceHTTPSRedirectHeaderCreatorSpy: jest.SpyInstance<
    ReturnType<typeof rules.createForceHTTPSRedirectHeader>,
    Parameters<typeof rules.createForceHTTPSRedirectHeader>
  >;
  let frameGuardHeaderCreatorSpy: jest.SpyInstance<
    ReturnType<typeof rules.createFrameGuardHeader>,
    Parameters<typeof rules.createFrameGuardHeader>
  >;
  let noopenHeaderCreatorSpy: jest.SpyInstance<
    ReturnType<typeof rules.createNoopenHeader>,
    Parameters<typeof rules.createNoopenHeader>
  >;
  let nosniffHeaderCreatorSpy: jest.SpyInstance<
    ReturnType<typeof rules.createNosniffHeader>,
    Parameters<typeof rules.createNosniffHeader>
  >;
  let xssProtectionHeaderCreatorSpy: jest.SpyInstance<
    ReturnType<typeof rules.createXSSProtectionHeader>,
    Parameters<typeof rules.createXSSProtectionHeader>
  >;

  describe("calling rules", () => {
    beforeAll(() => {
      forceHTTPSRedirectHeaderCreatorSpy = jest.spyOn(rules, "createForceHTTPSRedirectHeader");
      frameGuardHeaderCreatorSpy = jest.spyOn(rules, "createFrameGuardHeader");
      noopenHeaderCreatorSpy = jest.spyOn(rules, "createNoopenHeader");
      nosniffHeaderCreatorSpy = jest.spyOn(rules, "createNosniffHeader");
      xssProtectionHeaderCreatorSpy = jest.spyOn(rules, "createXSSProtectionHeader");
    });

    it("should call each rules and give proper options", () => {
      const dummyOptions: Parameters<typeof createHeadersObject>[0] = {
        forceHTTPSRedirect: [123, { preload: true }],
        frameGuard: ["allow-from", { uri: "https://example.example.com" }],
        noopen: false,
        nosniff: false,
        xssProtection: ["report", { uri: "https://example.example.com" }],
      };
      createHeadersObject(dummyOptions);

      expect(forceHTTPSRedirectHeaderCreatorSpy).toBeCalledTimes(1);
      expect(forceHTTPSRedirectHeaderCreatorSpy).toBeCalledWith(dummyOptions.forceHTTPSRedirect);

      expect(frameGuardHeaderCreatorSpy).toBeCalledTimes(1);
      expect(frameGuardHeaderCreatorSpy).toBeCalledWith(dummyOptions.frameGuard);

      expect(noopenHeaderCreatorSpy).toBeCalledTimes(1);
      expect(noopenHeaderCreatorSpy).toBeCalledWith(dummyOptions.noopen);

      expect(nosniffHeaderCreatorSpy).toBeCalledTimes(1);
      expect(nosniffHeaderCreatorSpy).toBeCalledWith(dummyOptions.nosniff);

      expect(xssProtectionHeaderCreatorSpy).toBeCalledTimes(1);
      expect(xssProtectionHeaderCreatorSpy).toBeCalledWith(dummyOptions.xssProtection);
    });
  });

  describe("filtering", () => {
    beforeAll(() => {
      forceHTTPSRedirectHeaderCreatorSpy = jest.spyOn(rules, "createForceHTTPSRedirectHeader");
      forceHTTPSRedirectHeaderCreatorSpy.mockReturnValue({ name: "dummy-1", value: undefined });

      frameGuardHeaderCreatorSpy = jest.spyOn(rules, "createFrameGuardHeader");
      frameGuardHeaderCreatorSpy.mockReturnValue({ name: "dummy-2", value: "example-2" });

      noopenHeaderCreatorSpy = jest.spyOn(rules, "createNoopenHeader");
      noopenHeaderCreatorSpy.mockReturnValue({ name: "dummy-3", value: undefined });

      nosniffHeaderCreatorSpy = jest.spyOn(rules, "createNosniffHeader");
      nosniffHeaderCreatorSpy.mockReturnValue({ name: "dummy-4", value: "example-4" });

      xssProtectionHeaderCreatorSpy = jest.spyOn(rules, "createXSSProtectionHeader");
      xssProtectionHeaderCreatorSpy.mockReturnValue({ name: "dummy-3", value: undefined });
    });

    it("should omit headers which have undefined value", () => {
      const returnedHeaders = createHeadersObject();

      expect(returnedHeaders).not.toHaveProperty("dummy-1");
      expect(returnedHeaders).toHaveProperty("dummy-2", "example-2");
      expect(returnedHeaders).not.toHaveProperty("dummy-3");
      expect(returnedHeaders).toHaveProperty("dummy-4", "example-4");
      expect(returnedHeaders).not.toHaveProperty("dummy-5");
    });
  });
});
