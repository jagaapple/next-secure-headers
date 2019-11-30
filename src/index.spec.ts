import * as React from "react";

import * as rules from "./rules";
import { default as withSecureHeaders, createHeadersObject } from "./index";

describe("createHeadersObject", () => {
  let expectCTHeaderCreatorSpy: jest.SpyInstance<
    ReturnType<typeof rules.createExpectCTHeader>,
    Parameters<typeof rules.createExpectCTHeader>
  >;
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
  let referrerPolicyHeaderCreatorSpy: jest.SpyInstance<
    ReturnType<typeof rules.createReferrerPolicyHeader>,
    Parameters<typeof rules.createReferrerPolicyHeader>
  >;
  let xssProtectionHeaderCreatorSpy: jest.SpyInstance<
    ReturnType<typeof rules.createXSSProtectionHeader>,
    Parameters<typeof rules.createXSSProtectionHeader>
  >;

  describe("calling rules", () => {
    beforeAll(() => {
      expectCTHeaderCreatorSpy = jest.spyOn(rules, "createExpectCTHeader");
      forceHTTPSRedirectHeaderCreatorSpy = jest.spyOn(rules, "createForceHTTPSRedirectHeader");
      frameGuardHeaderCreatorSpy = jest.spyOn(rules, "createFrameGuardHeader");
      noopenHeaderCreatorSpy = jest.spyOn(rules, "createNoopenHeader");
      nosniffHeaderCreatorSpy = jest.spyOn(rules, "createNosniffHeader");
      referrerPolicyHeaderCreatorSpy = jest.spyOn(rules, "createReferrerPolicyHeader");
      xssProtectionHeaderCreatorSpy = jest.spyOn(rules, "createXSSProtectionHeader");
    });

    it("should call each rules and give proper options", () => {
      const dummyOptions: Parameters<typeof createHeadersObject>[0] = {
        expectCT: [true, { maxAge: 123, enforce: true, reportURI: "https://example.example.com" }],
        forceHTTPSRedirect: [true, { maxAge: 123, preload: true }],
        frameGuard: ["allow-from", { uri: "https://example.example.com" }],
        noopen: false,
        nosniff: false,
        xssProtection: ["report", { uri: "https://example.example.com" }],
      };
      createHeadersObject(dummyOptions);

      expect(expectCTHeaderCreatorSpy).toBeCalledTimes(1);
      expect(expectCTHeaderCreatorSpy).toBeCalledWith(dummyOptions.expectCT);

      expect(forceHTTPSRedirectHeaderCreatorSpy).toBeCalledTimes(1);
      expect(forceHTTPSRedirectHeaderCreatorSpy).toBeCalledWith(dummyOptions.forceHTTPSRedirect);

      expect(frameGuardHeaderCreatorSpy).toBeCalledTimes(1);
      expect(frameGuardHeaderCreatorSpy).toBeCalledWith(dummyOptions.frameGuard);

      expect(noopenHeaderCreatorSpy).toBeCalledTimes(1);
      expect(noopenHeaderCreatorSpy).toBeCalledWith(dummyOptions.noopen);

      expect(nosniffHeaderCreatorSpy).toBeCalledTimes(1);
      expect(nosniffHeaderCreatorSpy).toBeCalledWith(dummyOptions.nosniff);

      expect(referrerPolicyHeaderCreatorSpy).toBeCalledTimes(1);
      expect(referrerPolicyHeaderCreatorSpy).toBeCalledWith(dummyOptions.referrerPolicy);

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

describe("withSecureHeaders", () => {
  describe("getInitialProps", () => {
    test("a returned component can be rendered", () => {
      const DummyComponent = () => React.createElement("div");
      const ComponentWithSecureHeaders = withSecureHeaders()(DummyComponent);

      expect(() => ComponentWithSecureHeaders({})).not.toThrow();
    });

    context("when context doesn't exist", () => {
      it("should raise error", async () => {
        const DummyComponent = () => React.createElement("div");
        const ComponentWithSecureHeaders = withSecureHeaders()(DummyComponent);

        await expect(ComponentWithSecureHeaders.getInitialProps!(undefined as any)).rejects.toThrow();
      });
    });

    context('when "context.res" and "context.ctx.res" don\'t exist', () => {
      context('a component has "getInitialProps" function', () => {
        const dummyInitialProps = { dummy: "dummy" };

        it('should call the "getInitialProps" and return it', async () => {
          const DummyComponent = () => React.createElement("div");
          DummyComponent.getInitialProps = async () => dummyInitialProps;
          const ComponentWithSecureHeaders = withSecureHeaders()(DummyComponent);

          await expect(ComponentWithSecureHeaders.getInitialProps!({})).resolves.toBe(dummyInitialProps);
        });
      });

      context('a component don\'t have "getInitialProps" function', () => {
        it("should return an empty object", async () => {
          const DummyComponent = () => React.createElement("div");
          const ComponentWithSecureHeaders = withSecureHeaders()(DummyComponent);

          await expect(ComponentWithSecureHeaders.getInitialProps!({})).resolves.toEqual({});
        });
      });
    });

    context('when "context.res" exists', () => {
      it('should call "context.res.setHeader()"', async () => {
        const DummyComponent = () => React.createElement("div");
        const ComponentWithSecureHeaders = withSecureHeaders()(DummyComponent);

        const resSetHeeaderSpy = jest.fn();
        const dummyContext: any = { res: { setHeader: resSetHeeaderSpy } };
        await ComponentWithSecureHeaders.getInitialProps!(dummyContext);

        expect(resSetHeeaderSpy).toBeCalled();
      });

      it('should return the returned value from "getInitialProps"', async () => {
        const DummyComponent = () => React.createElement("div");
        const dummyInitialProps = { dummy: "dummy" };
        DummyComponent.getInitialProps = async () => dummyInitialProps;
        const ComponentWithSecureHeaders = withSecureHeaders()(DummyComponent);

        const dummyContext: any = { res: { setHeader: jest.fn() } };
        await expect(ComponentWithSecureHeaders.getInitialProps!(dummyContext)).resolves.toEqual(dummyInitialProps);
      });
    });

    context('when "context.ctx.res" exists', () => {
      it('should call "context.ctx.res.setHeader()"', async () => {
        const DummyComponent = () => React.createElement("div");
        const ComponentWithSecureHeaders = withSecureHeaders()(DummyComponent);

        const resSetHeeaderSpy = jest.fn();
        const dummyContext: any = { ctx: { res: { setHeader: resSetHeeaderSpy } } };
        await ComponentWithSecureHeaders.getInitialProps!(dummyContext);

        expect(resSetHeeaderSpy).toBeCalled();
      });

      it('should return the returned value from "getInitialProps"', async () => {
        const DummyComponent = () => React.createElement("div");
        const dummyInitialProps = { dummy: "dummy" };
        DummyComponent.getInitialProps = async () => dummyInitialProps;
        const ComponentWithSecureHeaders = withSecureHeaders()(DummyComponent);

        const dummyContext: any = { ctx: { res: { setHeader: jest.fn() } } };
        await expect(ComponentWithSecureHeaders.getInitialProps!(dummyContext)).resolves.toEqual(dummyInitialProps);
      });
    });
  });
});
