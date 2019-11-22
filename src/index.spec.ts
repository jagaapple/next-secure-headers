import { returnOne } from "./index";

describe("index.ts", () => {
  it("should return one", () => {
    expect(returnOne()).toBe(1);
  });
});
