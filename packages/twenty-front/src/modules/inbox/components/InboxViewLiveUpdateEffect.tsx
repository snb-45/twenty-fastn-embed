import { useListenToObjectRecordOperationBrowserEvent } from '@/browser-event/hooks/useListenToObjectRecordOperationBrowserEvent';
import { INBOX_VIEW_REFETCH_DEBOUNCE_IN_MS } from '@/inbox/constants/InboxViewRefetchDebounceInMs';
import { objectMetadataItemFamilySelector } from '@/object-metadata/states/objectMetadataItemFamilySelector';
import { useRefetchFindManyRecords } from '@/object-record/hooks/useRefetchFindManyRecords';
import { useRecordIndexContextOrThrow } from '@/object-record/record-index/contexts/RecordIndexContext';
import { useAtomFamilySelectorValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilySelectorValue';
import { StandardObjectNameSingular } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { useDebouncedCallback } from 'use-debounce';

// The view preset reads the member's participant row, which thread events do not carry
export const InboxViewLiveUpdateEffect = () => {
  const { objectMetadataItem } = useRecordIndexContextOrThrow();
  const participantObjectMetadataItem = useAtomFamilySelectorValue(
    objectMetadataItemFamilySelector,
    {
      objectName: StandardObjectNameSingular.AgentChatThreadParticipant,
      objectNameType: 'singular',
    },
  );

  const { refetchFindManyRecords } = useRefetchFindManyRecords({
    objectMetadataNamePlural: objectMetadataItem.namePlural,
  });

  const debouncedRefetchInboxViewThreads = useDebouncedCallback(
    () => void refetchFindManyRecords(),
    INBOX_VIEW_REFETCH_DEBOUNCE_IN_MS,
  );

  useListenToObjectRecordOperationBrowserEvent({
    onObjectRecordOperationBrowserEvent: debouncedRefetchInboxViewThreads,
    objectMetadataItemId: objectMetadataItem.id,
  });

  useListenToObjectRecordOperationBrowserEvent({
    onObjectRecordOperationBrowserEvent: debouncedRefetchInboxViewThreads,
    objectMetadataItemId: participantObjectMetadataItem?.id,
    enabled: isDefined(participantObjectMetadataItem),
  });

  return null;
};
