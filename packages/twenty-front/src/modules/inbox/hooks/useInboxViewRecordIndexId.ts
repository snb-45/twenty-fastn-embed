import { aiChatThreadObjectMetadataItemSelector } from '@/ai-chat/threads/states/selectors/aiChatThreadObjectMetadataItemSelector';
import { resolveInboxViewId } from '@/inbox/utils/resolveInboxViewId';
import { getRecordIndexIdFromObjectNamePluralAndViewId } from '@/object-record/utils/getRecordIndexIdFromObjectNamePluralAndViewId';
import { useWorkspaceSurfaceScopedComponentInstanceId } from '@/ui/layout/hooks/useWorkspaceSurfaceScopedComponentInstanceId';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { viewsSelector } from '@/views/states/selectors/viewsSelector';
import { useSearchParams } from 'react-router-dom';

export const useInboxViewRecordIndexId = () => {
  const [searchParams] = useSearchParams();
  const views = useAtomStateValue(viewsSelector);
  const aiChatThreadObjectMetadataItem = useAtomStateValue(
    aiChatThreadObjectMetadataItemSelector,
  );

  const inboxViewId = resolveInboxViewId({
    views,
    inboxThreadObjectMetadataItemId: aiChatThreadObjectMetadataItem?.id,
    viewIdFromQueryParams: searchParams.get('viewId'),
  });

  const recordIndexId = useWorkspaceSurfaceScopedComponentInstanceId(
    getRecordIndexIdFromObjectNamePluralAndViewId(
      aiChatThreadObjectMetadataItem?.namePlural ?? '',
      inboxViewId ?? '',
    ),
  );

  return { inboxViewId, recordIndexId };
};
