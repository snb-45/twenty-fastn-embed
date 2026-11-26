import { ObjectFilterDropdownComponentInstanceContext } from '@/object-record/object-filter-dropdown/states/contexts/ObjectFilterDropdownComponentInstanceContext';
import { ObjectOptionsDropdown } from '@/object-record/object-options-dropdown/components/ObjectOptionsDropdown';
import { ObjectSortDropdownButton } from '@/object-record/object-sort-dropdown/components/ObjectSortDropdownButton';
import { ObjectSortDropdownComponentInstanceContext } from '@/object-record/object-sort-dropdown/states/context/ObjectSortDropdownComponentInstanceContext';
import { getObjectSortDropdownId } from '@/object-record/object-sort-dropdown/utils/getObjectSortDropdownId';
import { RecordIndexViewBarEffect } from '@/object-record/record-index/components/RecordIndexViewBarEffect';
import { useRecordIndexContextOrThrow } from '@/object-record/record-index/contexts/RecordIndexContext';
import { recordIndexViewTypeState } from '@/object-record/record-index/states/recordIndexViewTypeState';
import { TopBar } from '@/ui/layout/top-bar/components/TopBar';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { UpdateViewButtonGroup } from '@/views/components/UpdateViewButtonGroup';
import { ViewBarAnyFieldFilterEffect } from '@/views/components/ViewBarAnyFieldFilterEffect';
import { ViewBarDetails } from '@/views/components/ViewBarDetails';
import { ViewBarFilterDropdown } from '@/views/components/ViewBarFilterDropdown';
import { ViewBarRecordFieldEffect } from '@/views/components/ViewBarRecordFieldEffect';
import { ViewBarRecordFilterEffect } from '@/views/components/ViewBarRecordFilterEffect';
import { ViewBarRecordFilterGroupEffect } from '@/views/components/ViewBarRecordFilterGroupEffect';
import { ViewBarRecordSortEffect } from '@/views/components/ViewBarRecordSortEffect';
import { ViewType } from '@/views/types/ViewType';
import { getViewBarFilterDropdownId } from '@/views/utils/getViewBarFilterDropdownId';
import { ViewPickerDropdown } from '@/views/view-picker/components/ViewPickerDropdown';

// ViewBar reads the object from the record index route, which the inbox route does not have
export const InboxViewBar = () => {
  const { objectNamePlural, recordIndexId, objectMetadataItem } =
    useRecordIndexContextOrThrow();

  const recordIndexViewType = useAtomComponentStateValue(
    recordIndexViewTypeState,
  );

  return (
    <ObjectSortDropdownComponentInstanceContext.Provider
      value={{ instanceId: getObjectSortDropdownId(recordIndexId) }}
    >
      <ViewBarRecordFilterGroupEffect />
      <ViewBarAnyFieldFilterEffect />
      <ViewBarRecordFieldEffect />
      <ViewBarRecordFilterEffect />
      <ViewBarRecordSortEffect />
      <RecordIndexViewBarEffect
        objectNamePlural={objectNamePlural}
        viewBarId={recordIndexId}
      />
      <TopBar
        leftComponent={<ViewPickerDropdown />}
        rightComponent={
          <>
            <ObjectFilterDropdownComponentInstanceContext.Provider
              value={{ instanceId: getViewBarFilterDropdownId(recordIndexId) }}
            >
              <ViewBarFilterDropdown />
            </ObjectFilterDropdownComponentInstanceContext.Provider>
            <ObjectSortDropdownButton />
            <ObjectOptionsDropdown
              recordIndexId={recordIndexId}
              objectMetadataItem={objectMetadataItem}
              viewType={recordIndexViewType ?? ViewType.TABLE}
            />
          </>
        }
        bottomComponent={
          <ViewBarDetails
            hasFilterButton
            viewBarId={recordIndexId}
            objectNamePlural={objectNamePlural}
            rightComponent={<UpdateViewButtonGroup />}
          />
        }
      />
    </ObjectSortDropdownComponentInstanceContext.Provider>
  );
};
