import { callFastn, type FastnApiOptions } from 'src/logic-functions/utils/fastn-api.util';

export type EmbedSessionInput = {
  workspaceId: string;
  workspaceName: string;
  userEmail: string;
  userName: string;
  iframeConfigId?: string;
};

export type EmbedSessionResult =
  | { success: true; url: string; expiresAt?: string }
  | { success: false; error: string };

const errorText = (body: Record<string, unknown>): string =>
  String(body.error ?? body.message ?? 'Unknown error');

// fastn answers a workspace it has never seen with 404 IDENTITY_ORG_NOT_FOUND.
const isUnknownCustomer = (status: number, body: Record<string, unknown>) =>
  status === 404 && body.code === 'IDENTITY_ORG_NOT_FOUND';

// The workspace is the fastn customer, keyed by its Twenty workspace id. The
// token is minted first; the customer is created only the first time a
// workspace opens the page, then the token is minted again.
export const openEmbedSession = async (
  options: FastnApiOptions,
  input: EmbedSessionInput,
): Promise<EmbedSessionResult> => {
  const identity = { orgId: input.workspaceId, userId: input.userEmail };
  const mint = () =>
    callFastn(
      options,
      '/api/v1/embed/token',
      { userEmail: input.userEmail, userName: input.userName },
      identity,
    );

  let token = await mint();

  if (isUnknownCustomer(token.status, token.body)) {
    const created = await callFastn(
      options,
      '/v1/orgs',
      { name: input.workspaceName, orgId: input.workspaceId },
      { userId: input.userEmail },
    );

    if (
      created.status >= 300 &&
      !/already used/i.test(errorText(created.body))
    ) {
      return {
        success: false,
        error: `Could not register this workspace with fastn: ${errorText(created.body)}`,
      };
    }

    token = await mint();
  }

  const data = token.body.data as
    | { token?: string; expiresAt?: string }
    | undefined;

  if (token.status >= 300 || !data?.token) {
    return {
      success: false,
      error: `Could not open a fastn session: ${errorText(token.body)}`,
    };
  }

  const url = new URL(`${options.apiUrl.replace(/\/+$/, '')}/v1/embed/iframe`);

  url.searchParams.set('token', data.token);

  if (input.iframeConfigId) {
    url.searchParams.set('config', input.iframeConfigId);
  }

  return { success: true, url: url.toString(), expiresAt: data.expiresAt };
};
