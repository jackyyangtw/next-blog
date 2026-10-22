import { describe, expect, test } from "vitest";
import { isEmailAllowed, parseAllowedEmails } from "./allowed-emails";

describe("parseAllowedEmails", () => {
  test("以逗號分隔並去除空白、轉為小寫", () => {
    expect(
      parseAllowedEmails(" Jacky@Example.com , other@example.com ,"),
    ).toEqual(["jacky@example.com", "other@example.com"]);
  });

  test("未設定環境變數時回傳空陣列", () => {
    expect(parseAllowedEmails(undefined)).toEqual([]);
    expect(parseAllowedEmails("")).toEqual([]);
  });
});

describe("isEmailAllowed", () => {
  const allowed = ["jacky@example.com"];

  test("白名單內的 email 不分大小寫皆允許登入", () => {
    expect(isEmailAllowed("Jacky@Example.com", allowed)).toBe(true);
  });

  test("不在白名單內的 email 拒絕登入", () => {
    expect(isEmailAllowed("stranger@example.com", allowed)).toBe(false);
  });

  test("沒有 email 時拒絕登入", () => {
    expect(isEmailAllowed(undefined, allowed)).toBe(false);
    expect(isEmailAllowed(null, allowed)).toBe(false);
  });

  test("白名單為空時一律拒絕登入", () => {
    expect(isEmailAllowed("jacky@example.com", [])).toBe(false);
  });
});
