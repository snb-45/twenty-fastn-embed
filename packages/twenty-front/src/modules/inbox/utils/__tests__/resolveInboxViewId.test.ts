import { resolveInboxViewId } from '@/inbox/utils/resolveInboxViewId';
import { ViewType } from '@/views/types/ViewType';
import { STANDARD_OBJECTS } from 'twenty-shared/metadata';

const INBOX_THREAD_OBJECT_METADATA_ITEM_ID = 'inbox-thread-object';

const doneView = {
  id: 'done-view',
  type: ViewType.LIST,
  position: 5,
  objectMetadataId: INBOX_THREAD_OBJECT_METADATA_ITEM_ID,
  universalIdentifier:
    STANDARD_OBJECTS.agentChatThread.views.done.universalIdentifier,
};

const openView = {
  id: 'open-view',
  type: ViewType.LIST,
  position: 3,
  objectMetadataId: INBOX_THREAD_OBJECT_METADATA_ITEM_ID,
  universalIdentifier:
    STANDARD_OBJECTS.agentChatThread.views.open.universalIdentifier,
};

const tableView = {
  id: 'table-view',
  type: ViewType.TABLE,
  position: 1,
  objectMetadataId: INBOX_THREAD_OBJECT_METADATA_ITEM_ID,
};

const widgetView = {
  id: 'widget-view',
  type: ViewType.LIST_WIDGET,
  position: 0,
  objectMetadataId: INBOX_THREAD_OBJECT_METADATA_ITEM_ID,
};

const otherObjectView = {
  id: 'other-object-view',
  type: ViewType.LIST,
  position: 0,
  objectMetadataId: 'other-object',
};

const views = [doneView, openView, tableView, widgetView, otherObjectView];

describe('resolveInboxViewId', () => {
  it.each([doneView.id, tableView.id])(
    'should return the inbox thread view %s named in the query parameter',
    (viewIdFromQueryParams) => {
      expect(
        resolveInboxViewId({
          views,
          inboxThreadObjectMetadataItemId: INBOX_THREAD_OBJECT_METADATA_ITEM_ID,
          viewIdFromQueryParams,
        }),
      ).toBe(viewIdFromQueryParams);
    },
  );

  it.each([null, widgetView.id, otherObjectView.id, 'unknown-view'])(
    'should fall back to the standard Open view when the query parameter is %s',
    (viewIdFromQueryParams) => {
      expect(
        resolveInboxViewId({
          views,
          inboxThreadObjectMetadataItemId: INBOX_THREAD_OBJECT_METADATA_ITEM_ID,
          viewIdFromQueryParams,
        }),
      ).toBe(openView.id);
    },
  );

  it('should return the first inbox thread view by position when the standard Open view is missing', () => {
    expect(
      resolveInboxViewId({
        views: [doneView, tableView, widgetView, otherObjectView],
        inboxThreadObjectMetadataItemId: INBOX_THREAD_OBJECT_METADATA_ITEM_ID,
        viewIdFromQueryParams: null,
      }),
    ).toBe(tableView.id);
  });

  it('should return undefined when the inbox thread object has no view', () => {
    expect(
      resolveInboxViewId({
        views: [widgetView, otherObjectView],
        inboxThreadObjectMetadataItemId: INBOX_THREAD_OBJECT_METADATA_ITEM_ID,
        viewIdFromQueryParams: null,
      }),
    ).toBeUndefined();
  });
});
