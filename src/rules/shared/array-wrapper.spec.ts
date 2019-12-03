import { wrapArray } from "./array-wrapper";

describe("wrapArray", () => {
  context("when giving a value not array", () => {
    it("should wrap the value as array", () => {
      const value = 123;
      expect(wrapArray(value)).toEqual([value]);
    });
  });

  context("when giving an array", () => {
    it("should return the value", () => {
      const value = [123];
      expect(wrapArray(value)).toEqual(value);
    });
  });
});
