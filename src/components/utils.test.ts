import { expect, test } from "vitest";
import { fromURL } from "./utils";

test("fromURL ja.chordwiki.org", () => {
  const url =
    "https://ja.chordwiki.org/wiki.cgi?c=view&t=%E3%83%80%E3%83%96%E3%83%AB%E3%83%A9%E3%83%AA%E3%82%A2%E3%83%83%E3%83%88";
  const res = fromURL(new URL(url));
  expect(res).toEqual({ songId: "chordwiki:ダブルラリアット" });
});

test("fromURL chordwiki.jpn.org", () => {
  const url =
    "http://chordwiki.jpn.org/wiki.cgi?c=view&t=%A5%C0%A5%D6%A5%EB%A5%E9%A5%EA%A5%A2%A5%C3%A5%C8";
  const res = fromURL(new URL(url));
  expect(res).toEqual({ songId: "chordwiki:ダブルラリアット" });
});
