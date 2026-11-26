import { isNonEmptyString } from '@sniptt/guards';
import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppPath } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';
import { FeatureFlagKey } from '~/generated-metadata/graphql';
import { useNavigateApp } from '~/hooks/useNavigateApp';
import { getCurrentHistoryEntryState } from '~/utils/getCurrentHistoryEntryState';

export const useNavigateToInboxThread = () => {
  const navigate = useNavigateApp();
  const isInboxViewsEnabled = useIsFeatureEnabled(
    FeatureFlagKey.IS_INBOX_VIEWS_ENABLED,
  );
  const [searchParams] = useSearchParams();
  const viewId = searchParams.get('viewId');
  const inboxViewId =
    isInboxViewsEnabled && isNonEmptyString(viewId) ? viewId : undefined;

  const navigateToInboxThread = useCallback(
    ({
      threadId,
      replace = false,
    }: {
      threadId: string | null;
      replace?: boolean;
    }) =>
      // oxlint-disable-next-line twenty/no-navigate-prefer-link
      navigate(
        AppPath.AiChatInbox,
        { threadId },
        isDefined(inboxViewId) ? { viewId: inboxViewId } : undefined,
        {
          replace,
          state: getCurrentHistoryEntryState(),
        },
      ),
    [inboxViewId, navigate],
  );

  return { navigateToInboxThread };
};
