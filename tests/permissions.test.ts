import { describe, expect, it } from "vitest";
import { accessFor, can, type DocumentAction } from "@/features/documents/permissions";

const doc = { ownerId: "alice", sharedWithIds: ["bob"] };

describe("accessFor", () => {
  it("gives the owner owner access", () => {
    expect(accessFor(doc, "alice")).toBe("owner");
  });

  it("gives people the doc is shared with editor access", () => {
    expect(accessFor(doc, "bob")).toBe("editor");
  });

  it("gives everyone else no access", () => {
    expect(accessFor(doc, "carol")).toBeNull();
  });
});

describe("can", () => {
  const matrix: [ReturnType<typeof accessFor>, Record<DocumentAction, boolean>][] = [
    ["owner", { view: true, edit: true, share: true, delete: true }],
    ["editor", { view: true, edit: true, share: false, delete: false }],
    [null, { view: false, edit: false, share: false, delete: false }],
  ];

  for (const [access, expected] of matrix) {
    for (const [action, allowed] of Object.entries(expected) as [DocumentAction, boolean][]) {
      it(`${access ?? "no access"} ${allowed ? "can" : "cannot"} ${action}`, () => {
        expect(can(access, action)).toBe(allowed);
      });
    }
  }
});
