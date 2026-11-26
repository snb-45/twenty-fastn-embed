import { useEffect, useState } from 'react';
import { RestApiClient } from 'twenty-client-sdk/rest';
import { defineFrontComponent } from 'twenty-sdk/define';
import { t } from 'twenty-sdk/front-component';
import { MainButton, Section } from 'twenty-ui/components';
import { themeCssVariables } from 'twenty-ui/theme';
import styled from '@emotion/styled';
import 'twenty-ui/style.css';

import { EMBED_SESSION_ROUTE_PATH } from 'src/constants/server-variables';
import { SETTINGS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from 'src/constants/universal-identifiers';
import { type EmbedSessionResult } from 'src/logic-functions/utils/open-embed-session.util';

const StyledContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: ${() => themeCssVariables.spacing[4]};
  width: 100%;
`;

const StyledFrame = styled.iframe`
  border: none;
  border-radius: ${() => themeCssVariables.border.radius.md};
  height: 720px;
  width: 100%;
`;

const FastnIntegrations = () => {
  const [session, setSession] = useState<EmbedSessionResult | null>(null);

  useEffect(() => {
    new RestApiClient()
      .get(`/s${EMBED_SESSION_ROUTE_PATH}`)
      .then((result) => setSession(result as EmbedSessionResult))
      .catch((error: unknown) =>
        setSession({ success: false, error: String(error) }),
      );
  }, []);

  if (session === null) {
    return <StyledContainer>{t('Loading integrations...')}</StyledContainer>;
  }

  if (!session.success) {
    return <StyledContainer>{session.error}</StyledContainer>;
  }

  return (
    <StyledContainer>
      <Section.Root>
        <MainButton onClick={() => window.open(session.url, '_blank')}>
          {t('Open in a new tab')}
        </MainButton>
      </Section.Root>
      <StyledFrame src={session.url} title={t('Integrations')} />
    </StyledContainer>
  );
};

export default defineFrontComponent({
  universalIdentifier: SETTINGS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'fastn-integrations',
  description:
    'The fastn integrations hub: connect and manage the apps this workspace syncs with.',
  component: FastnIntegrations,
});
