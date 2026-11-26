import { defineApplication, FieldType } from 'twenty-sdk/define';

import {
  DEFAULT_FASTN_API_URL,
  FASTN_API_KEY_ENV_VAR_NAME,
  FASTN_API_URL_ENV_VAR_NAME,
  FASTN_IDENTITY_SECRET_ENV_VAR_NAME,
  FASTN_IFRAME_CONFIG_ID_ENV_VAR_NAME,
} from 'src/constants/server-variables';
import {
  APP_DESCRIPTION,
  APP_DISPLAY_NAME,
  APPLICATION_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  logo: 'public/logo.svg',
  author: 'fastn',
  category: 'Productivity',
  displayName: APP_DISPLAY_NAME,
  description: APP_DESCRIPTION,
  serverVariables: {
    [FASTN_API_KEY_ENV_VAR_NAME]: {
      description:
        'A fastn API key (fsk_live_...) with identity verification, from fastn > API keys. Used server-side only to register each workspace and mint its widget session.',
      isSecret: true,
      type: FieldType.TEXT,
    },
    [FASTN_IDENTITY_SECRET_ENV_VAR_NAME]: {
      description:
        'The identity secret shown once next to that API key. Signs which workspace and user each session is for.',
      isSecret: true,
      type: FieldType.TEXT,
    },
    [FASTN_API_URL_ENV_VAR_NAME]: {
      description: `fastn API base URL. Defaults to ${DEFAULT_FASTN_API_URL} when unset.`,
      isSecret: false,
      type: FieldType.TEXT,
    },
    [FASTN_IFRAME_CONFIG_ID_ENV_VAR_NAME]: {
      description:
        'Optional fastn iframe config id (eic_...) that restyles the hub: colours, logo, title, start screen.',
      isSecret: false,
      type: FieldType.TEXT,
    },
  },
});
