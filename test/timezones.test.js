const assert = require("assert");
const { readFileSync } = require("fs");
const { join } = require("path");

const source = readFileSync(join(__dirname, "..", "v1.ts"), "utf8");
const match = source.match(/var RUSSIAN_TIMEZONES = \[([\s\S]*?)\];/);

assert(match, "Expected v1.ts to define RUSSIAN_TIMEZONES");

const timezones = [...match[1].matchAll(/"([^"]+)"/g)].map(([, timezone]) => timezone);

assert(
  timezones.includes("Asia/Ust-Nera"),
  "Russian timezone list should include the IANA Asia/Ust-Nera timezone"
);
assert(
  !timezones.includes("Asia/Ust"),
  "Asia/Ust is not a valid IANA timezone; use Asia/Ust-Nera instead"
);

if (typeof Intl.supportedValuesOf === "function") {
  const supportedTimezones = new Set(Intl.supportedValuesOf("timeZone"));
  assert(
    supportedTimezones.has("Asia/Ust-Nera"),
    "Runtime Intl data should recognize Asia/Ust-Nera"
  );
  assert(
    !supportedTimezones.has("Asia/Ust"),
    "Runtime Intl data should not recognize the invalid Asia/Ust timezone"
  );
}
