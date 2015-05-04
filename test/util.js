import assert from "power-assert";
import * as util from "../src/util";

describe("util", function() {
  describe("size4", function() {
    it("(num: number): number", function() {
      assert(util.size4(0) === 0);
      assert(util.size4(1) === 4);
      assert(util.size4(2) === 4);
      assert(util.size4(3) === 4);
      assert(util.size4(4) === 4);
      assert(util.size4(5) === 8);
      assert(util.size4(6) === 8);
      assert(util.size4(7) === 8);
      assert(util.size4(8) === 8);
    });
  });
});
