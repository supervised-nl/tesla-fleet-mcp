import { describe, expect, it } from "vitest";
import { vinOrDefault } from "../src/config.ts";
import { cap, endpointsQuery, qs } from "../src/util.ts";

describe("cap", () => {
  it("defaults and clamps", () => {
    expect(cap(undefined)).toBe(25);
    expect(cap(3)).toBe(3);
    expect(cap(999)).toBe(50);
    expect(cap(0)).toBe(25);
  });
});

describe("qs", () => {
  it("drops empty values", () => {
    expect(qs({ a: "x", b: undefined, c: "" })).toBe("?a=x");
  });
});

describe("vinOrDefault", () => {
  it("prefers argument", () => {
    expect(vinOrDefault("XP7")).toBe("XP7");
  });

  it("throws when missing", () => {
    const prev = process.env.TESLA_VIN;
    delete process.env.TESLA_VIN;
    expect(() => vinOrDefault()).toThrow(/Missing vin/);
    if (prev !== undefined) process.env.TESLA_VIN = prev;
  });
});

describe("endpointsQuery", () => {
  it("omits the query when unset", () => {
    expect(endpointsQuery()).toBe("");
    expect(endpointsQuery("")).toBe("");
  });

  it("uses a single name", () => {
    expect(endpointsQuery("charge_state")).toBe("?endpoints=charge_state");
  });

  it("joins with encoded semicolons, not commas", () => {
    expect(endpointsQuery("charge_state,climate_state,vehicle_state")).toBe(
      "?endpoints=charge_state%3Bclimate_state%3Bvehicle_state",
    );
    expect(endpointsQuery("charge_state;climate_state")).toBe(
      "?endpoints=charge_state%3Bclimate_state",
    );
  });
});
