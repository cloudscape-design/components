// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CollectionPreferencesProps } from '~components/collection-preferences';

export const collectionPreferencesI18nStrings: CollectionPreferencesProps.VisibleContentPreference['i18nStrings'] = {
  liveAnnouncementDndStarted: (position, total) => `Picked up item at position ${position} of ${total}`,
  liveAnnouncementDndDiscarded: 'Reordering canceled',
  liveAnnouncementDndItemReordered: (position, total) => `Moving item to position ${position} of ${total}`,
  liveAnnouncementDndItemCommitted: (initialPosition, finalPosition, total) =>
    `Item moved from position ${initialPosition} to position ${finalPosition} of ${total}`,
  screenReaderInstructions:
    'To pick up a draggable item, press space or enter. \n' +
    'While dragging, use the arrow keys to move the item in any given direction.\n' +
    'Press space or enter again to drop the item in its new position, or press escape to cancel.',
};
