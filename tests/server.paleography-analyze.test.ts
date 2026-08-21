// Force test mode BEFORE importing server.ts, so it registers routes on
// `app` without calling startServer() (no Vite middleware, no port 3000).
process.env.NODE_ENV = "test";

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";

const { app, geminiClient, MAX_IMAGE_BYTES } = await import("../server.ts");

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

// `errorMatch` pins each case to the check that is meant to reject it, so a
// request cannot pass the test by failing an earlier, unrelated validation.
const REJECTED_REQUESTS: Array<{
  name: string;
  body: Record<string, unknown>;
  errorMatch: RegExp;
}> = [
  {
    name: "missing imageBase64",
    body: { customPrompt: "transcribe esto" },
    errorMatch: /debes subir una imagen/i,
  },
  {
    name: "empty imageBase64",
    body: { imageBase64: "", mimeType: "image/jpeg" },
    errorMatch: /debes subir una imagen/i,
  },
  {
    name: "image present but missing mimeType",
    body: { imageBase64: "data:image/jpeg;base64,SGVsbG8=" },
    errorMatch: /formato de imagen no soportado/i,
  },
  {
    name: "empty mimeType",
    body: { imageBase64: "data:image/jpeg;base64,SGVsbG8=", mimeType: "" },
    errorMatch: /formato de imagen no soportado/i,
  },
  {
    name: "disallowed mimeType image/gif",
    body: { imageBase64: "data:image/gif;base64,SGVsbG8=", mimeType: "image/gif" },
    errorMatch: /formato de imagen no soportado/i,
  },
  {
    name: "disallowed mimeType application/pdf",
    body: { imageBase64: "data:application/pdf;base64,SGVsbG8=", mimeType: "application/pdf" },
    errorMatch: /formato de imagen no soportado/i,
  },
  {
    name: "data URL with an empty base64 payload",
    body: { imageBase64: "data:image/jpeg;base64,", mimeType: "image/jpeg" },
    errorMatch: /está vacía/i,
  },
  {
    name: "base64 with characters outside the alphabet",
    body: { imageBase64: "data:image/jpeg;base64,SGVs*bG8=", mimeType: "image/jpeg" },
    errorMatch: /base64 válido/i,
  },
  {
    name: "base64 whose length is not a multiple of 4",
    body: { imageBase64: "data:image/jpeg;base64,SGVsbG8", mimeType: "image/jpeg" },
    errorMatch: /base64 válido/i,
  },
  {
    name: "raw payload that is not base64 at all",
    body: { imageBase64: "esto no es base64", mimeType: "image/jpeg" },
    errorMatch: /base64 válido/i,
  },
  {
    name: "data URL MIME image/png against a declared image/jpeg",
    body: { imageBase64: "data:image/png;base64,SGVsbG8=", mimeType: "image/jpeg" },
    errorMatch: /no coincide con el contenido/i,
  },
  {
    name: "data URL MIME image/jpeg against a declared image/webp",
    body: { imageBase64: "data:image/jpeg;base64,SGVsbG8=", mimeType: "image/webp" },
    errorMatch: /no coincide con el contenido/i,
  },
];

test("rejects invalid requests with 400 and never calls Gemini", async (t) => {
  for (const { name, body, errorMatch } of REJECTED_REQUESTS) {
    await t.test(name, async (st) => {
      const spy = st.mock.method(geminiClient, "generateContent");

      const res = await postAnalyze(body);
      const data = await res.json();

      assert.equal(res.status, 400);
      assert.equal(typeof data.error, "string");
      assert.match(data.error, errorMatch);
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
  assert.equal(call.config.responseMimeType, "application/json");
  assert.equal(call.contents.parts[0].inlineData.mimeType, "image/jpeg");
  assert.equal(call.contents.parts[0].inlineData.data, "SGVsbG8=");
});

test("sends no sampling parameters: gemini-3.6-flash no longer accepts them", async (t) => {
  const spy = t.mock.method(geminiClient, "generateContent", async () => ({
    text: '{"literalTranscription":"stub"}',
  }));

  const res = await postAnalyze({
    imageBase64: "data:image/jpeg;base64,SGVsbG8=",
    mimeType: "image/jpeg",
  });

  assert.equal(res.status, 200);
  const { config } = spy.mock.calls[0].arguments[0] as any;
  for (const samplingParam of ["temperature", "topP", "topK", "top_p", "top_k"]) {
    assert.ok(
      !(samplingParam in config),
      `config no debe incluir el parámetro de muestreo "${samplingParam}"`
    );
  }
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

// Builds a base64 payload that decodes to approximately `bytes` bytes.
// 4 base64 chars carry 3 bytes, so the length is rounded up to a multiple of 4.
function base64OfSize(bytes: number): string {
  const chars = Math.ceil((bytes * 4) / 3 / 4) * 4;
  return "A".repeat(chars);
}

test("rejects an image above the size limit with 413 and never calls Gemini", async (t) => {
  const spy = t.mock.method(geminiClient, "generateContent");

  const res = await postAnalyze({
    imageBase64: `data:image/jpeg;base64,${base64OfSize(MAX_IMAGE_BYTES + 1024 * 1024)}`,
    mimeType: "image/jpeg",
  });
  const data = await res.json();

  assert.equal(res.status, 413);
  assert.match(data.error, /demasiado grande/i);
  assert.match(data.error, /20 MB/);
  assert.equal(spy.mock.callCount(), 0);
});

test("accepts an image just under the size limit", async (t) => {
  const spy = t.mock.method(geminiClient, "generateContent", async () => ({
    text: '{"literalTranscription":"stub"}',
  }));

  const res = await postAnalyze({
    imageBase64: base64OfSize(MAX_IMAGE_BYTES - 512 * 1024),
    mimeType: "image/jpeg",
  });

  assert.equal(res.status, 200);
  assert.equal(spy.mock.callCount(), 1);
});

test("answers with JSON, not an HTML error page, when the body exceeds the parser limit", async (t) => {
  const spy = t.mock.method(geminiClient, "generateContent");

  // Above express.json()'s 30mb ceiling, so the request never reaches the route.
  const res = await postAnalyze({
    imageBase64: base64OfSize(31 * 1024 * 1024),
    mimeType: "image/jpeg",
  });

  assert.equal(res.status, 413);
  assert.match(res.headers.get("content-type") ?? "", /application\/json/);
  const data = await res.json();
  assert.match(data.error, /demasiado grande/i);
  assert.equal(spy.mock.callCount(), 0);
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
