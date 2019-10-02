import { denestWithKey } from "../Utils";

test("denestWithKey", () => {
  const o = {
    prop: {
      1: {
        a: 1,
        b: 2,
        c: 3
      },
      2: {
        a: 4,
        b: 5,
        c: 1
      }
    }
  };

  const dn = denestWithKey("prop")("v_id")(o);
  expect(dn.length).toEqual(2);
  expect(dn[0]["v_id"] === "1").toEqual(true);
});
