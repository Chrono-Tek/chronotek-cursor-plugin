# Chronotek Pro Agent for Cursor

Connect Cursor to Chronotek Pro's hosted MCP service to review workforce activity, schedules, timecards, coverage and attendance issues. Perform supported actions within the signed-in user's company, region, role and granted permissions. An eligible Chronotek Pro account with Agent access is required.

## Install and connect

Once accepted, install Chronotek Pro Agent from the Cursor Marketplace. For local testing before listing:

1. Copy this plugin directory into `~/.cursor/plugins/local/chronotek-pro-agent`. The directory must contain `.cursor-plugin/plugin.json` and `mcp.json`. Do not put the enclosing submission materials in that directory.
2. Restart Cursor or run **Developer: Reload Window**. Open **Customize** and confirm the Chronotek plugin and its MCP server appear. Local imports must be permitted by your organization's Cursor settings.
3. Connect the `chronotek` server and complete browser sign-in and consent on Chronotek's own authorization page.
4. Request a fresh profile read and confirm the intended identity, company and available access before requesting business data or changes.

The configuration uses public OAuth client `chronotek-cursor` with PKCE and no client secret. Registered callbacks are `http://localhost:8787/callback` for desktop and `https://www.cursor.com/agents/mcp/oauth/callback` for web/Agents. Do not replace this ID with the Grok Build client or add a shared secret. Dynamic client registration is not required.

Requested scopes are `agent.read`, `agent.write` and `offline_access`. They permit authorized reads, permitted writes and token refresh; they do not grant access beyond the connected account. For a local read-only configuration, omit `agent.write` before connecting and review the resulting consent. A new authorization may replace an existing Chronotek agent installation for that same user after explicit confirmation.

## Examples and approvals

- "Read my Chronotek profile and show my company and permitted workforce features. Do not change anything."
- "Show outstanding attendance issues for the regions I can access."
- "Propose a supported change, show the exact target and fields, and wait for my explicit approval before applying it."

Review tool output before approving actions. Do not use workforce summaries as a substitute for payroll processing or compliance review. Testing should use suitable isolated demo records and restore any approved reversible change.

## Data and network access

| Endpoint | Purpose |
|---|---|
| `https://admin.mychronotek.com/mcp` | MCP discovery, tool descriptions and authorized workforce operations. |
| `https://admin.mychronotek.com/.well-known/oauth-protected-resource` | Protected-resource metadata. |
| `https://auth.mychronotek.com` | Authorization discovery, browser sign-in, consent, token exchange/refresh and revocation. |

Workforce data returned by Chronotek tools is shared with Cursor to answer the user's requests. Review your organization's policies and the providers' privacy terms before connecting employee or customer data. Cursor manages tokens through its normal authentication mechanisms. Disable the plugin to stop using its tools; contact Chronotek support for help revoking server-side access.

This package adds no telemetry and contains only static metadata/configuration, documentation, the license and an approved icon. It includes no executable server, installation scripts, hooks, skills, agents, filesystem readers, client secret or reviewer credentials.

## Support and license

Published by The Chrono-Tek Company, Inc. Product information is available on the [Chronotek website](https://www.chronotek.com). See the [privacy policy](https://www.chronotek.com/privacy), [service terms](https://www.chronotek.com/terms) and [support page](https://www.chronotek.com/contact). Include the client version, failure time and a sanitized correlation ID in support requests. Do not post passwords, authorization codes, tokens or customer records in public issues.

The files in this repository, including the icon artwork, are licensed under the [Apache License 2.0](LICENSE). See [NOTICE](NOTICE) for the copyright and trademark notice. The license does not grant rights to Chronotek's names or trademarks beyond the license's limited allowance for identifying the work. Chronotek's hosted MCP service and customer data are not part of this repository or licensed by it. Marketplace listing does not imply endorsement by Cursor.
