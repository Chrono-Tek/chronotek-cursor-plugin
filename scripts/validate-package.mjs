import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = [
  ".cursor-plugin/plugin.json",
  "mcp.json",
  "README.md",
  "LICENSE",
  "NOTICE",
  "assets/icon.png",
  "certification.json"
];

for (const relativePath of requiredFiles) {
  const path = join(root, relativePath);
  assert.ok(existsSync(path), `Missing required package file: ${relativePath}`);
  assert.ok(statSync(path).size > 0, `Required package file is empty: ${relativePath}`);
}

const readJson = (relativePath) => JSON.parse(readFileSync(join(root, relativePath), "utf8"));
const plugin = readJson(".cursor-plugin/plugin.json");
const mcp = readJson("mcp.json");
const certification = readJson("certification.json");
const readme = readFileSync(join(root, "README.md"), "utf8");

assert.equal(plugin.name, certification.package.name, "Plugin name and certification package name differ");
assert.equal(plugin.version, certification.package.version, "Plugin and certification package versions differ");
assert.equal(plugin.mcpServers, "mcp.json", "Plugin must reference the root MCP configuration");
assert.equal(plugin.license, "Apache-2.0", "Plugin license must remain Apache-2.0");

const chronotek = mcp.mcpServers?.chronotek;
assert.ok(chronotek, "mcp.json must define the chronotek server");
assert.equal(chronotek.url, certification.oauth.resource, "MCP resource URL differs from certification evidence");
assert.equal(chronotek.auth?.CLIENT_ID, certification.oauth.clientId, "OAuth client ID differs from certification evidence");
assert.deepEqual(chronotek.auth?.scopes, certification.oauth.scopes, "OAuth scopes differ from certification evidence");

const inventory = certification.agent.inventory;
const requiredReadmeValues = [
  `Package ${certification.package.version}`,
  `MCP ${certification.agent.mcpVersion}`,
  certification.agent.capabilityCatalogVersion,
  certification.agent.semanticCatalogVersion,
  certification.agent.supervisorGuideVersion,
  certification.agent.administratorGuideVersion,
  certification.agent.commit,
  certification.agent.artifact,
  `${inventory.tools} tools`,
  `${inventory.readTools} read`,
  `${inventory.writeTools} write`,
  `${inventory.capabilityBranches} capability branches`,
  `${inventory.definitions} definitions`
];

for (const value of requiredReadmeValues) {
  assert.ok(readme.includes(value), `README is missing certified value: ${value}`);
}

const packageText = [
  readme,
  JSON.stringify(plugin),
  JSON.stringify(mcp),
  JSON.stringify(certification)
].join("\n").toLowerCase();
const forbiddenFragments = [
  "mcp " + "9.2",
  "job" + "-instruction",
  "job" + "_" + "instruction",
  "get_" + "job_" + "instructions",
  "manage_" + "job_" + "instructions"
];

for (const fragment of forbiddenFragments) {
  assert.ok(!packageText.includes(fragment), `Package contains deferred capability reference: ${fragment}`);
}

const png = readFileSync(join(root, "assets/icon.png"));
assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], "assets/icon.png is not a valid PNG");

console.log(`Validated ${plugin.name} ${plugin.version} against MCP ${certification.agent.mcpVersion} (${inventory.tools} tools).`);
