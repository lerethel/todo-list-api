import { describe, it } from "mocha";
import assert from "node:assert";
import { request } from "./helpers/common.js";

describe("/non-existent-route", () => {
  it("POST, expect 404", async () => {
    const response = await request.post("/non-existent-route");
    assert.strictEqual(response.status, 404);
  });

  it("GET, expect 404", async () => {
    const response = await request.get("/non-existent-route");
    assert.strictEqual(response.status, 404);
  });

  it("PUT, expect 404", async () => {
    const response = await request.put("/non-existent-route");
    assert.strictEqual(response.status, 404);
  });

  it("DELETE, expect 404", async () => {
    const response = await request.delete("/non-existent-route");
    assert.strictEqual(response.status, 404);
  });
});
