// Force test mode BEFORE importing server.ts, so it registers routes on
// `app` without calling startServer() (no Vite middleware, no port 3000).
process.env.NODE_ENV = "test";

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";

const { app, geminiClient } = await import("../server.ts");

let server: Server;
let baseUrl: string;

before(() => {
  server = app.listen(0);
  const { port } = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${port}`;
});

after(() => {
  server.close();
});

function postAnalyze(body: unknown) {
  return fetch(`${baseUrl}/api/paleography/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const REJECTED_REQUESTS: Array<{ name: string; body: Record<string, unknown> }> = [
  { name: "missing imageBase64", body: { customPrompt: "transcribe esto" } },
  { name: "empty imageBase64", body: { imageBase64: "", mimeType: "image/jpeg" } },
  { name: "image present but missing mimeType", body: { imageBase64: "data:image/jpeg;base64,SGVsbG8=" } },
  { name: "empty mimeType", body: { imageBase64: "data:image/jpeg;base64,SGVsbG8=", mimeType: "" } },
  {
    name: "disallowed mimeType image/gif",
    body: { imageBase64: "data:image/gif;base64,SGVsbG8=", mimeType: "image/gif" },
  },
  {
    name: "disallowed mimeType application/pdf",
    body: { imageBase64: "data:application/pdf;base64,SGVsbG8=", mimeType: "application/pdf" },
  },
];

test("rejects invalid requests with 400 and never calls Gemini", async (t) => {
  for (const { name, body } of REJECTED_REQUESTS) {
    await t.test(name, async (st) => {
      const spy = st.mock.method(geminiClient, "generateContent");

      const res = await postAnalyze(body);
      const data = await res.json();

      assert.equal(res.status, 400);
      assert.equal(typeof data.error, "string");
      assert.equal(spy.mock.callCount(), 0);
    });
  }
});

test("accepts image/jpeg, preserves the mimeType and strips only the data-URL prefix", async (t) => {
  const spy = t.mock.method(geminiClient, "generateContent", async () => ({
    text: '{"literalTranscription":"stub"}',
  }));

  const res = await postAnalyze({
    imageBase64: "data:image/jpeg;base64,SGVsbG8=",
    mimeType: "image/jpeg",
    customPrompt: "transcribe esto",
  });

  assert.equal(res.status, 200);
  assert.equal(spy.mock.callCount(), 1);

  const call = spy.mock.calls[0].arguments[0] as any;
  assert.equal(call.model, "gemini-3.6-flash");
  assert.equal(call.config.temperature, 0.2);
  assert.equal(call.config.responseMimeType, "application/json");
  assert.equal(call.contents.parts[0].inlineData.mimeType, "image/jpeg");
  assert.equal(call.contents.parts[0].inlineData.data, "SGVsbG8=");
});

test("accepts image/png and preserves it as image/png (no longer defaults to jpeg)", async (t) => {
  const spy = t.mock.method(geminiClient, "generateContent", async () => ({
    text: '{"literalTranscription":"stub"}',
  }));

  const res = await postAnalyze({
    imageBase64: "data:image/png;base64,SGVsbG8=",
    mimeType: "image/png",
  });

  assert.equal(res.status, 200);
  const call = spy.mock.calls[0].arguments[0] as any;
  assert.equal(call.contents.parts[0].inlineData.mimeType, "image/png");
  assert.equal(call.contents.parts[0].inlineData.data, "SGVsbG8=");
});

test("accepts image/webp and preserves it as image/webp", async (t) => {
  const spy = t.mock.method(geminiClient, "generateContent", async () => ({
    text: '{"literalTranscription":"stub"}',
  }));

  const res = await postAnalyze({
    imageBase64: "data:image/webp;base64,SGVsbG8=",
    mimeType: "image/webp",
  });

  assert.equal(res.status, 200);
  const call = spy.mock.calls[0].arguments[0] as any;
  assert.equal(call.contents.parts[0].inlineData.mimeType, "image/webp");
});
