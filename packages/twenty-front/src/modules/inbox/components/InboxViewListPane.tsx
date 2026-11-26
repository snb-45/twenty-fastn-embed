import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme';

import { aiChatThreadObjectMetadataItemSelector } from '@/ai-chat/threads/states/selectors/aiChatThreadObjectMetadataItemSelector';
import { contextStoreCurrentViewIdComponentState } from '@/context-store/states/contextStoreCurrentViewIdComponentState';
import { InboxListHeader } from '@/inbox/components/InboxListHeader';
import { InboxViewBar } from '@/inbox/components/InboxViewBar';
import { InboxViewContextStoreEffect } from '@/inbox/components/InboxViewContextStoreEffect';
import { InboxViewLiveUpdateEffect } from '@/inbox/components/InboxViewLiveUpdateEffect';
import { InboxViewRecordIndexProvider } from '@/inbox/components/InboxViewRecordIndexProvider';
import { useInboxViewRecordIndexId } from '@/inbox/hooks/useInboxViewRecordIndexId';
import { RecordIndexContainer } from '@/object-record/record-index/components/RecordIndexContainer';
import { PageCardLayout } from '@/ui/layout/page/components/PageCardLayout';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

const StyledListPane = styled.div<{ $isFullWidth: boolean }>`
  display: flex;
  flex: 0 0 auto;
  min-width: 0;
  transition: width calc(${themeCssVariables.animation.duration.normal} * 1s)
    ease-in-out;
  width: ${({ $isFullWidth }) =>
    $isFullWidth ? '100%' : 'var(--inbox-list-pane-width)'};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const StyledRecordIndexContainer = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  width: 100%;
`;

type InboxViewListPaneProps = {
  isFullWidth: boolean;
  isSecondaryPaneShown: boolean;
};

export const InboxViewListPane = ({
  isFullWidth,
  isSecondaryPaneShown,
}: InboxViewListPaneProps) => {
  const { t } = useLingui();
  const { inboxViewId, recordIndexId } = useInboxViewRecordIndexId();
  const aiChatThreadObjectMetadataItem = useAtomStateValue(
    aiChatThreadObjectMetadataItemSelector,
  );
  const contextStoreCurrentViewId = useAtomComponentStateValue(
    contextStoreCurrentViewIdComponentState,
  );

  const isInboxViewResolved =
    isDefined(inboxViewId) && isDefined(aiChatThreadObjectMetadataItem);
  const isContextStoreOnInboxView =
    isInboxViewResolved && contextStoreCurrentViewId === inboxViewId;

  const header = (
    <InboxListHeader
      selectedThreadCount={0}
      isSecondaryPaneShown={isSecondaryPaneShown}
    />
  );

  return (
    <StyledListPane
      $isFullWidth={isFullWidth}
      role="region"
      aria-label={t`Conversation list`}
    >
      {isInboxViewResolved && (
        <InboxViewContextStoreEffect
          inboxViewId={inboxViewId}
          inboxThreadObjectMetadataItemId={aiChatThreadObjectMetadataItem.id}
        />
      )}
      {isContextStoreOnInboxView ? (
        <InboxViewRecordIndexProvider
          key={recordIndexId}
          inboxThreadObjectMetadataItem={aiChatThreadObjectMetadataItem}
          recordIndexId={recordIndexId}
        >
          <InboxViewLiveUpdateEffect />
          <PageCardLayout
            showInformationBanner={isFullWidth}
            header={header}
            secondaryBar={<InboxViewBar />}
          >
            <StyledRecordIndexContainer>
              <RecordIndexContainer />
            </StyledRecordIndexContainer>
          </PageCardLayout>
        </InboxViewRecordIndexProvider>
      ) : (
        <PageCardLayout showInformationBanner={isFullWidth} header={header}>
          {null}
        </PageCardLayout>
      )}
    </StyledListPane>
  );
};
