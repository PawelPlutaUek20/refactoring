import { Province, sampleProvinceData } from "./building-tests";

describe("province", function() {
  it("shortfall", function() {
    const asia = new Province(sampleProvinceData());
    expect(asia.shortfall).toBe(5);
  });
});
