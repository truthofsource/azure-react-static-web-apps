import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/apiClient.ts", import.meta.url), "utf8");
const exports = {};
vm.runInNewContext(ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, { exports, Error });

const read = (body, status = 422) => exports.readJsonApiResponse(
  Response.json(body, { status }), "Request failed"
);
const generic = "Bulk application CSV validation failed.";
for (const message of [
  "applications.csv row 2: work_authorized must be true or false.",
  "application_references.csv: child row references an unknown source_application_ref.",
]) {
  await assert.rejects(read({
    ok: false, code: "invalid_csv", error: generic, validation: { message },
  }), (error) => error.message === message);
}
for (const validation of [undefined, null, "invalid", {}, { message: 12 }, { message: "  " }]) {
  await assert.rejects(read({ code: "invalid_csv", error: generic, validation }),
    (error) => error.message === generic);
}
await assert.rejects(read({
  code: "other_error", validation: { message: "Ignore unrelated data" },
  detail: "Specific detail", error: "Generic error",
}), (error) => error.message === "Specific detail");
await assert.rejects(read({}), (error) => error.message.includes("Check the entered values"));
const success = { ok: true, records: [] };
assert.deepEqual(await read(success, 200), success);
console.log("API error detail and success response checks passed");

for (const status of [200, 502, 503]) {
  await assert.rejects(exports.readJsonApiResponse(new Response("<html>unavailable</html>",{status}),"Service unavailable. Reload saved status before retrying."), error => error.name === "ApiResponseError" && error.message.includes("empty or unreadable response") && error.responseBody.unreadableResponse === true && exports.isUnreadableApiResponse(error));
}

assert.equal(exports.isUnreadableApiResponse(new Error("Other failure")), false);
for (const body of [null, true, false, 42, "saved"]) {
  await assert.rejects(exports.readJsonApiResponse(Response.json(body), "The save could not be confirmed."),
    error => exports.isUnreadableApiResponse(error) && error.message.includes("saved status before trying again"));
}
assert.deepEqual(await exports.readJsonApiResponse(Response.json([]), "Load failed."), []);

for (const [status, instruction] of [[401, "Sign in again"], [403, "Ask an Admin"], [409, "Reload"], [413, "smaller file"], [415, "formats"], [429, "Wait"], [503, "saved status"]]) {
  await assert.rejects(read({}, status), error => error.message.includes(instruction));
}
for (const message of ["Failed to fetch", "NetworkError when attempting to fetch resource.", "Load failed"]) {
  const result = exports.describeRequestError(new Error(message), "The ID upload could not be confirmed.");
  assert.match(result, /ID upload/); assert.match(result, /connection/); assert.match(result, /avoid a duplicate/);
}
assert.equal(exports.describeRequestError(new Error(" "), "Choose a photo."), "Choose a photo.");
assert.equal(exports.describeRequestError(Object.assign(new Error(), { message: null }), "Reload the saved item."), "Reload the saved item.");
assert.equal(exports.describeRequestError(new Error("Choose a JPEG photo under 5 MiB."), "Upload failed."), "Choose a JPEG photo under 5 MiB.");
assert.match(exports.describeRequestError(Object.assign(new Error("Timeout"), { name: "TimeoutError" }), "Saving failed."), /did not respond in time/);
await assert.rejects(read({ message: "Choose one employee." }), error => error.message === "Choose one employee.");
console.log("Contextual error, status, blank-message and safe-retry checks passed");

assert.match(exports.describeRequestError(new SyntaxError("Unexpected end of JSON input"), "The report could not be loaded."), /returned data could not be read/);
await assert.rejects(read({error:"Unauthorized"}, 401), error => error.message.includes("Sign in again"));
await assert.rejects(read({error:"Document upload failed."}, 500), error => error.message.includes("saved status before trying again"));

for (const status of [502,503,504]) {
 await assert.rejects(read({},status), error => error.message.includes("switched off") && error.message.includes("Ask an Admin"));
}
await assert.rejects(read({error:"Stage 2 document upload is not currently available."},503), error => error.message.includes("switched off"));
const busy="Photo conversion is busy. Wait a moment and upload the same photo again.";
await assert.rejects(read({error:busy},503), error => error.message===busy);
for (const status of [401,403,413,415,422]) {
 await assert.rejects(read({},status), error => !error.message.includes("switched off"));
}
assert.match(exports.describeRequestError(new Error("Failed to fetch"),"Upload not confirmed."),/switched off/);
