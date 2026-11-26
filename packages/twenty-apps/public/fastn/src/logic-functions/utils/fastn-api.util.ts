import { createHmac } from 'node:crypto';

export type FastnApiOptions = {
  apiUrl: string;
  apiKey: string;
  identitySecret: string;
  fetchImpl?: typeof fetch;
};

export type FastnResponse = { status: number; body: Record<string, unknown> };

// fastn verifies who a call is for with HMAC-SHA256("{org}\n{user}", identitySecret)
// sent beside the API key, so a key alone cannot claim another workspace.
export const signIdentity = (
  identitySecret: string,
  orgId: string,
  userId: string,
): string =>
  createHmac('sha256', identitySecret)
    .update(`${orgId}\n${userId}`)
    .digest('hex');

export const callFastn = async (
  options: FastnApiOptions,
  path: string,
  body: Record<string, unknown>,
  identity: { orgId?: string; userId: string },
): Promise<FastnResponse> => {
  const orgId = identity.orgId ?? '';
  const headers: Record<string, string> = {
    authorization: `Bearer ${options.apiKey}`,
    'content-type': 'application/json',
    'x-user-id': identity.userId,
    'x-identity-hmac': signIdentity(
      options.identitySecret,
      orgId,
      identity.userId,
    ),
  };

  if (orgId !== '') {
    headers['x-org-id'] = orgId;
  }

  const response = await (options.fetchImpl ?? fetch)(
    `${options.apiUrl.replace(/\/+$/, '')}${path}`,
    { method: 'POST', headers, body: JSON.stringify(body) },
  );
  const text = await response.text();
  let parsed: Record<string, unknown> = {};

  try {
    parsed = JSON.parse(text) as Record<string, unknown>;
  } catch {
    parsed = { error: text.slice(0, 200) };
  }

  return { status: response.status, body: parsed };
};
