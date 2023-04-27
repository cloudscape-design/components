// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CollectionPreferencesProps } from '~components/collection-preferences/interfaces';

export const contentDisplayPreferenceI18nStrings: Partial<CollectionPreferencesProps.ContentDisplayPreference> = {
  liveAnnouncementDndStarted: (position, total) => `Picked up item at position ${position} of ${total}`,
  liveAnnouncementDndDiscarded: 'Reordering canceled',
  liveAnnouncementDndItemReordered: (initialPosition, currentPosition, total) =>
    initialPosition === currentPosition
      ? `Moving item back to position ${currentPosition} of ${total}`
      : `Moving item to position ${currentPosition} of ${total}`,
  liveAnnouncementDndItemCommitted: (initialPosition, finalPosition, total) =>
    initialPosition === finalPosition
      ? `Item moved back to its original position ${initialPosition} of ${total}`
      : `Item moved from position ${initialPosition} to position ${finalPosition} of ${total}`,
  dragHandleAriaDescription:
    "Use Space or Enter to activate drag for an item, then use the arrow keys to move the item's position. To complete the position move, use Space or Enter, or to discard the move, use Escape.",
  dragHandleAriaLabel: 'Drag handle',
};
