import { describe, expect, it, vi } from 'vitest';

import { signIdentity } from 'src/logic-functions/utils/fastn-api.util';
import { openEmbedSession } from 'src/logic-functions/utils/open-embed-session.util';

const input = {
  workspaceId: 'ws-1',
  workspaceName: 'Acme',
  userEmail: 'ada@acme.test',
  userName: 'Ada Lovelace',
};

const respond = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status });

describe('openEmbedSession', () => {
  it('returns the iframe url when the workspace is already registered', async () => {
    const fetchImpl = vi.fn(async () =>
      respond(200, { data: { token: 'emb_1', expiresAt: '2030-01-01' } }),
    );

    const result = await openEmbedSession(
      { apiUrl: 'https://api.fastn.test/', apiKey: 'k', identitySecret: 's', fetchImpl },
      { ...input, iframeConfigId: 'eic_1' },
    );

    expect(result).toEqual({
      success: true,
      url: 'https://api.fastn.test/v1/embed/iframe?token=emb_1&config=eic_1',
      expiresAt: '2030-01-01',
    });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    const headers = init.headers as Record<string, string>;

    expect(headers['x-org-id']).toBe('ws-1');
    expect(headers['x-identity-hmac']).toBe(signIdentity('s', 'ws-1', 'ada@acme.test'));
  });

  it('registers an unknown workspace once, then mints the token', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(respond(404, { error: 'x-org-id does not match a customer organization of this account', code: 'IDENTITY_ORG_NOT_FOUND' }))
      .mockResolvedValueOnce(respond(201, { data: { id: 'org_1' } }))
      .mockResolvedValueOnce(respond(200, { data: { token: 'emb_2' } }));

    const result = await openEmbedSession(
      { apiUrl: 'https://api.fastn.test', apiKey: 'k', identitySecret: 's', fetchImpl },
      input,
    );

    expect(result).toMatchObject({ success: true });
    const [orgsUrl, orgsInit] = fetchImpl.mock.calls[1] as [string, RequestInit];

    expect(orgsUrl).toBe('https://api.fastn.test/v1/orgs');
    expect(JSON.parse(String(orgsInit.body))).toEqual({ name: 'Acme', orgId: 'ws-1' });
  });

  it('treats an already registered workspace as registered', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(respond(404, { error: 'x-org-id does not match a customer organization of this account', code: 'IDENTITY_ORG_NOT_FOUND' }))
      .mockResolvedValueOnce(respond(400, { error: 'External ID "ws-1" is already used by customer "Acme"' }))
      .mockResolvedValueOnce(respond(200, { data: { token: 'emb_3' } }));

    const result = await openEmbedSession(
      { apiUrl: 'https://api.fastn.test', apiKey: 'k', identitySecret: 's', fetchImpl },
      input,
    );

    expect(result).toMatchObject({ success: true });
  });

  it('reports a fastn error instead of throwing', async () => {
    const fetchImpl = vi.fn(async () => respond(401, { error: 'Invalid API key' }));

    const result = await openEmbedSession(
      { apiUrl: 'https://api.fastn.test', apiKey: 'bad', identitySecret: 's', fetchImpl },
      input,
    );

    expect(result).toEqual({
      success: false,
      error: 'Could not open a fastn session: Invalid API key',
    });
  });
});
