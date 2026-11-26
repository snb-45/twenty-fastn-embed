# fastn

Adds an **Integrations** page to Twenty's settings with the
[fastn](https://fastn.ai) integrations hub, so each workspace can connect the apps it
already uses (HubSpot, Salesforce, Slack, Gmail, Stripe and more) without leaving
Twenty.

## How it works

1. A member opens **Settings > Integrations**.
2. The page calls the app's `fastn-embed-session` logic function (an authenticated
   HTTP route).
3. The function reads the current workspace and user, then asks fastn for a session
   for that workspace. The first time a workspace opens the page, it is registered
   with fastn as a customer keyed by its Twenty workspace id; after that it is
   looked up directly.
4. The page shows the fastn hub for that session. Each workspace sees only its own
   connections.

The fastn API key and identity secret stay server-side, in the app's secret
variables. Every call to fastn is signed with
`HMAC-SHA256("{workspaceId}\n{userEmail}", identitySecret)`, so the key alone
cannot open a session for another workspace.

## Setup

1. In fastn, create an API key with identity verification required (fastn >
   API keys). Copy the key and its identity secret.
2. Install the app in Twenty and set its variables:

| Variable | Required | What it is |
| --- | --- | --- |
| `FASTN_API_KEY` | yes | The fastn API key (`fsk_live_...`). Secret. |
| `FASTN_IDENTITY_SECRET` | yes | The identity secret shown with that key. Secret. |
| `FASTN_API_URL` | no | fastn API base URL. Defaults to `https://api.fastn.dev`. |
| `FASTN_IFRAME_CONFIG_ID` | no | A fastn iframe config (`eic_...`) to restyle the hub. |

3. Open **Settings > Integrations**.

Twenty runs app iframes without same-origin access. If the embedded hub cannot
reach fastn from inside that sandbox, **Open in a new tab** opens the same session
in its own tab.

## Development

```bash
yarn install
yarn test        # unit tests
yarn typecheck
yarn lint
```
