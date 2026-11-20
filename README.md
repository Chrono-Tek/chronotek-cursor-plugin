# Chronotek Pro Agent for Cursor

Connect Cursor to Chronotek Pro's hosted MCP service to review workforce activity, schedules, timecards, coverage and attendance issues. Perform supported actions within the signed-in user's company, region, role and granted permissions. An eligible Chronotek Pro account with Agent access is required.

## Install and connect

Once accepted, install Chronotek Pro Agent from the Cursor Marketplace. For local testing before listing:

1. Copy this plugin directory into `~/.cursor/plugins/local/chronotek-pro-agent`. The directory must contain `.cursor-plugin/plugin.json` and `mcp.json`. Do not put the enclosing submission materials in that directory.
2. Restart Cursor or run **Developer: Reload Window**. Open **Customize** and confirm the Chronotek plugin and its MCP server appear. Local imports must be permitted by your organization's Cursor settings.
3. Connect the `chronotek` server and complete browser sign-in and consent on Chronotek's own authorization page.
4. On the first interaction, call `get_connection_profile` and then `get_agent_context`. Confirm the intended connected account, company, viewing region, granted scopes and effective capabilities before requesting business data or changes.
5. Follow the guidance advertised by `get_agent_context`. If supervisor guidance is available, call `get_chronotek_supervisor_guidance` with `topic=onboarding`; load the applicable administrator guidance before multi-step administrative work.

The configuration uses public OAuth client `chronotek-cursor` with PKCE and no client secret. Registered callbacks are `http://localhost:8787/callback` for desktop and `https://www.cursor.com/agents/mcp/oauth/callback` for web/Agents. Do not replace this ID with the Grok Build client or add a shared secret. Dynamic client registration is not required.

Requested scopes are `agent.read`, `agent.write` and `offline_access`. They permit authorized reads, permitted writes and token refresh; they do not grant access beyond the connected account. For a local read-only configuration, omit `agent.write` before connecting and review the resulting consent. A new authorization may replace an existing Chronotek agent installation for that same user after explicit confirmation.

## Certified MCP 9.1 compatibility

Package 1.0.1 is aligned with the deployed Chronotek Agent MCP 9.1.0 contract. The certification baseline is production artifact `2026.11.20.5`, built from Agent `main` commit `5db46d80720f85a851ba88c6afd317ee26b0bc39`, with capability catalog `2026-11-19.1`, semantic catalog 7.1.0, supervisor guide 3.2.0 and administrator guide 2.3.0. A fully enabled region administrator can discover 55 tools (34 read and 21 write), 87 capability branches and 138 definitions. Other connected accounts receive only their effective subset.

Cursor discovers the current tools and their schemas from the hosted service; `get_agent_context` is the authoritative inventory for the connected account. Do not infer access from a role or rely on a tool or selector branch that is absent from that response. See the machine-readable [certification evidence](certification.json) for the exact package and deployed-source baseline.

MCP 9.0 introduced the smaller selector-based tool families. Existing natural-language requests continue to work, but saved prompts or workflows that name retired tools should use the consolidated family instead. Common migrations include:

| Earlier tools | MCP 9.0 tool |
|---|---|
| `get_agent_profile`, `get_chronotek_capabilities` | `get_agent_context` |
| `get_own_profile`, `get_own_notification_profile` | `get_own_settings` with the appropriate `section` |
| `get_roster`, `get_employee_detail`, `get_employee_app_settings` | `get_employees` with the appropriate `operation` |
| `get_job_detail`, `get_job_alarm_codes`, `get_timetiles` | `get_job` with the appropriate `section` |
| `get_message_destinations`, `get_messages`, `get_required_read_messages` | `get_messaging` with the appropriate `view` |

MCP 9.1 adds three important workflows while preserving the same endpoint, OAuth resource and scopes:

- **Connected human's own language:** read `get_own_settings` with `section=language`, then use `update_own_settings` with the same section only after the user approves the exact canonical language. This route never accepts an employee ID.
- **Managed employee language and Mobile App Settings:** read `get_employees` with `operation=detail` or `operation=app_settings`. `update_employee` keeps `section=language` and `section=app_settings` independent. App Settings changes always include the complete three-value TimeTile scan state. Never substitute this route for the connected human's own-language route.
- **Directional trip settings:** eligible company and region administrators can read one exact ordered route with `get_trip_settings` and change its shared defaults with `manage_trip_settings`. Raise a route-default suggestion only while working with travel, never in a check-in, and only after at least three trips on the same directional route. Show the direction, current defaults, estimate, buffer and exact proposed values; wait for approval; write once; and read the same route back. A timecard review, correction or approval does not authorize a shared trip-setting change.

After the hosted service is upgraded, restart Cursor or run **Developer: Reload Window** before testing so Cursor refreshes cached tool definitions. Reconnection is needed only when Cursor reports an authorization problem; a tool-schema update alone does not require granting new OAuth scopes.

## Examples and approvals

- "Show my connected Chronotek account, company, viewing region and currently available workforce features. Do not change anything."
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
