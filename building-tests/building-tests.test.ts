import { Province, sampleProvinceData } from "./building-tests";
import { beforeEach, describe, expect, it } from "bun:test";

describe("province", function () {
  let asia: Province;

  beforeEach(function () {
    asia = new Province(sampleProvinceData());
  });

  it("shortfall", function () {
    expect(asia.shortfall).toBe(5);
  });

  it("profit", function () {
    expect(asia.profit).toBe(230);
  });

  it("change production", function () {
    asia.producers[0].production = 20;
    expect(asia.shortfall).toBe(-6);
    expect(asia.profit).toBe(292);
  });

  it("zero demand", function () {
    asia.demand = "0";
    expect(asia.shortfall).toBe(-25);
    expect(asia.profit).toBe(0);
  });

  it("negative demand", function () {
    asia.demand = "-1";
    expect(asia.shortfall).toBe(-26);
    expect(asia.profit).toBe(-10);
  });

  it("empty string demand", function () {
    asia.demand = "";
    expect(asia.shortfall).toBeNaN();
    expect(asia.profit).toBeNaN();
  });
});

describe("no producers", function () {
  let noProducers: Province;

  beforeEach(function () {
    const data = {
      name: "No producers",
      producers: [],
      demand: 30,
      price: 20,
    };

    noProducers = new Province(data);
  });

  it("shortfall", function () {
    expect(noProducers.shortfall).toBe(30);
  });

  it("profit", function () {
    expect(noProducers.profit).toBe(0);
  });
});
