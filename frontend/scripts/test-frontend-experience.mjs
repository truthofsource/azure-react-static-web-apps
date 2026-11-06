import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/frontendExperience.ts", import.meta.url), "utf8");
const exports = {};
vm.runInNewContext(ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, { exports });
const resolve = (hostname, pathname = "/") => exports.resolveFrontendExperience({ hostname, pathname });
for (const host of ["apply.example.invalid", "apply-nonprod.example.invalid", "APPLY-NONPROD.example.invalid."]) {
  assert.equal(resolve(host), "public-employment-application");
  assert.equal(resolve(host, "/stage2/token"), "public-stage2");
}
for (const host of ["portal.example.invalid", "portal-nonprod.example.invalid", "localhost", "apply-nonprod.example.invalid.example.com"]) {
  assert.equal(resolve(host), "private-portal");
  assert.equal(resolve(host, "/apply"), "public-employment-application");
  assert.equal(resolve(host, "/apply/next"), "public-employment-application");
  assert.equal(resolve(host, "/apply-other"), "private-portal");
}
assert.equal(resolve("portal-nonprod.example.invalid", "/payroll-handoff"), "payroll-handoff");
assert.equal(resolve("apply-nonprod.example.invalid", "/payroll-handoff"), "public-employment-application");
console.log("Frontend hostname and path routing checks passed");
