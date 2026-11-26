import { useNavigateToInboxThread } from '@/inbox/hooks/useNavigateToInboxThread';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { RecordComponentInstanceContextsWrapper } from '@/object-record/components/RecordComponentInstanceContextsWrapper';
import { useObjectPermissions } from '@/object-record/hooks/useObjectPermissions';
import { RecordFieldColumnsProvider } from '@/object-record/record-column-scope/components/RecordFieldColumnsProvider';
import { RecordIndexLoadBaseOnContextStoreEffect } from '@/object-record/record-index/components/RecordIndexLoadBaseOnContextStoreEffect';
import { RecordIndexViewFieldsSSESyncEffect } from '@/object-record/record-index/components/RecordIndexViewFieldsSSESyncEffect';
import { RecordIndexContextProvider } from '@/object-record/record-index/contexts/RecordIndexContext';
import { useRecordIndexFieldMetadataDerivedStates } from '@/object-record/record-index/hooks/useRecordIndexFieldMetadataDerivedStates';
import { ViewComponentInstanceContext } from '@/views/states/contexts/ViewComponentInstanceContext';
import { type ReactNode } from 'react';
import { AppPath } from 'twenty-shared/types';
import { getAppPath } from 'twenty-shared/utils';

type InboxViewRecordIndexProviderProps = {
  inboxThreadObjectMetadataItem: EnrichedObjectMetadataItem;
  recordIndexId: string;
  children: ReactNode;
};

export const InboxViewRecordIndexProvider = ({
  inboxThreadObjectMetadataItem,
  recordIndexId,
  children,
}: InboxViewRecordIndexProviderProps) => {
  const { objectPermissionsByObjectMetadataId } = useObjectPermissions();
  const { navigateToInboxThread } = useNavigateToInboxThread();

  const {
    fieldDefinitionByFieldMetadataItemId,
    fieldMetadataItemByFieldMetadataItemId,
    labelIdentifierFieldMetadataItem,
    recordFieldByFieldMetadataItemId,
  } = useRecordIndexFieldMetadataDerivedStates(
    inboxThreadObjectMetadataItem,
    recordIndexId,
  );

  return (
    <RecordIndexContextProvider
      value={{
        objectPermissionsByObjectMetadataId,
        recordIndexId,
        viewBarInstanceId: recordIndexId,
        objectNamePlural: inboxThreadObjectMetadataItem.namePlural,
        objectNameSingular: inboxThreadObjectMetadataItem.nameSingular,
        objectMetadataItem: inboxThreadObjectMetadataItem,
        onIndexRecordsLoaded: () => {},
        indexIdentifierUrl: (threadId) =>
          getAppPath(AppPath.AiChatInbox, { threadId }),
        onOpenRecord: (threadId) => navigateToInboxThread({ threadId }),
        recordFieldByFieldMetadataItemId,
        labelIdentifierFieldMetadataItem,
        fieldMetadataItemByFieldMetadataItemId,
        fieldDefinitionByFieldMetadataItemId,
      }}
    >
      <ViewComponentInstanceContext.Provider
        value={{ instanceId: recordIndexId }}
      >
        <RecordComponentInstanceContextsWrapper
          componentInstanceId={recordIndexId}
        >
          <RecordFieldColumnsProvider>{children}</RecordFieldColumnsProvider>
        </RecordComponentInstanceContextsWrapper>
        <RecordIndexLoadBaseOnContextStoreEffect />
        <RecordIndexViewFieldsSSESyncEffect />
      </ViewComponentInstanceContext.Provider>
    </RecordIndexContextProvider>
  );
};
