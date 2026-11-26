import { isNonEmptyString } from '@sniptt/guards';
import { MetadataApiClient } from 'twenty-client-sdk/metadata';
import { defineLogicFunction } from 'twenty-sdk/define';

import {
  DEFAULT_FASTN_API_URL,
  EMBED_SESSION_ROUTE_PATH,
  FASTN_API_KEY_ENV_VAR_NAME,
  FASTN_API_URL_ENV_VAR_NAME,
  FASTN_IDENTITY_SECRET_ENV_VAR_NAME,
  FASTN_IFRAME_CONFIG_ID_ENV_VAR_NAME,
} from 'src/constants/server-variables';
import { EMBED_SESSION_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
import {
  type EmbedSessionResult,
  openEmbedSession,
} from 'src/logic-functions/utils/open-embed-session.util';

export const fastnEmbedSessionHandler =
  async (): Promise<EmbedSessionResult> => {
    const apiKey = process.env[FASTN_API_KEY_ENV_VAR_NAME];
    const identitySecret = process.env[FASTN_IDENTITY_SECRET_ENV_VAR_NAME];

    if (!isNonEmptyString(apiKey) || !isNonEmptyString(identitySecret)) {
      return {
        success: false,
        error:
          'fastn is not configured yet: set FASTN_API_KEY and FASTN_IDENTITY_SECRET in the app settings.',
      };
    }

    const { currentUser } = await new MetadataApiClient().query({
      currentUser: {
        email: true,
        firstName: true,
        lastName: true,
        currentWorkspace: { id: true, displayName: true },
      },
    });
    const workspaceId = currentUser.currentWorkspace?.id;

    if (!isNonEmptyString(workspaceId)) {
      return { success: false, error: 'No current workspace.' };
    }

    const apiUrl = process.env[FASTN_API_URL_ENV_VAR_NAME];
    const iframeConfigId = process.env[FASTN_IFRAME_CONFIG_ID_ENV_VAR_NAME];

    return openEmbedSession(
      {
        apiUrl: isNonEmptyString(apiUrl) ? apiUrl : DEFAULT_FASTN_API_URL,
        apiKey,
        identitySecret,
      },
      {
        workspaceId,
        workspaceName: currentUser.currentWorkspace?.displayName ?? workspaceId,
        userEmail: currentUser.email,
        userName: [currentUser.firstName, currentUser.lastName]
          .filter(isNonEmptyString)
          .join(' '),
        iframeConfigId: isNonEmptyString(iframeConfigId)
          ? iframeConfigId
          : undefined,
      },
    );
  };

export default defineLogicFunction({
  universalIdentifier: EMBED_SESSION_LOGIC_FUNCTION_UNIVERSAL_IDENTIFIER,
  name: 'fastn-embed-session',
  description:
    'Registers the workspace with fastn on first use and returns a fresh session URL for the fastn integrations hub.',
  timeoutSeconds: 30,
  handler: fastnEmbedSessionHandler,
  httpRouteTriggerSettings: {
    path: EMBED_SESSION_ROUTE_PATH,
    httpMethod: 'GET',
    isAuthRequired: true,
  },
});
