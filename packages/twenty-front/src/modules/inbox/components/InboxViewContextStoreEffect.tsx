import { contextStoreCurrentObjectMetadataItemIdComponentState } from '@/context-store/states/contextStoreCurrentObjectMetadataItemIdComponentState';
import { contextStoreCurrentViewIdComponentState } from '@/context-store/states/contextStoreCurrentViewIdComponentState';
import { useSetAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useSetAtomComponentState';
import { useEffect } from 'react';

type InboxViewContextStoreEffectProps = {
  inboxViewId: string;
  inboxThreadObjectMetadataItemId: string;
};

export const InboxViewContextStoreEffect = ({
  inboxViewId,
  inboxThreadObjectMetadataItemId,
}: InboxViewContextStoreEffectProps) => {
  const setContextStoreCurrentObjectMetadataItemId = useSetAtomComponentState(
    contextStoreCurrentObjectMetadataItemIdComponentState,
  );
  const setContextStoreCurrentViewId = useSetAtomComponentState(
    contextStoreCurrentViewIdComponentState,
  );

  useEffect(() => {
    setContextStoreCurrentObjectMetadataItemId(inboxThreadObjectMetadataItemId);
    setContextStoreCurrentViewId(inboxViewId);

    return () => setContextStoreCurrentViewId(undefined);
  }, [
    inboxThreadObjectMetadataItemId,
    inboxViewId,
    setContextStoreCurrentObjectMetadataItemId,
    setContextStoreCurrentViewId,
  ]);

  return null;
};
