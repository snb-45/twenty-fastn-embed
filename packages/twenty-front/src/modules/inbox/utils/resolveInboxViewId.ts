import { type View } from '@/views/types/View';
import { STANDARD_OBJECTS } from 'twenty-shared/metadata';
import { isDefined, isWidgetViewType } from 'twenty-shared/utils';

type InboxViewCandidate = Pick<
  View,
  'id' | 'type' | 'objectMetadataId' | 'position' | 'universalIdentifier'
>;

export const resolveInboxViewId = ({
  views,
  inboxThreadObjectMetadataItemId,
  viewIdFromQueryParams,
}: {
  views: InboxViewCandidate[];
  inboxThreadObjectMetadataItemId: string | undefined;
  viewIdFromQueryParams: string | null;
}): string | undefined => {
  if (!isDefined(inboxThreadObjectMetadataItemId)) {
    return undefined;
  }

  const inboxViews = views
    .filter(
      (view) =>
        view.objectMetadataId === inboxThreadObjectMetadataItemId &&
        !isWidgetViewType(view.type),
    )
    .sort(
      (firstView, secondView) =>
        firstView.position - secondView.position ||
        firstView.id.localeCompare(secondView.id),
    );

  const viewFromQueryParams = inboxViews.find(
    (view) => view.id === viewIdFromQueryParams,
  );

  if (isDefined(viewFromQueryParams)) {
    return viewFromQueryParams.id;
  }

  const standardOpenView = inboxViews.find(
    (view) =>
      view.universalIdentifier ===
      STANDARD_OBJECTS.agentChatThread.views.open.universalIdentifier,
  );

  return standardOpenView?.id ?? inboxViews[0]?.id;
};
