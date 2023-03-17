// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ContentDisplayPreference } from '~components/collection-preferences/interfaces';

export const collectionPreferencesI18nStrings: ContentDisplayPreference.I18nStrings = {
  liveAnnouncementDndStarted: (position, total) => `Picked up item at position ${position} of ${total}`,
  liveAnnouncementDndDiscarded: 'Reordering canceled',
  liveAnnouncementDndItemReordered: (position, total) => `Moving item to position ${position} of ${total}`,
  liveAnnouncementDndItemCommitted: (initialPosition, finalPosition, total) =>
    `Item moved from position ${initialPosition} to position ${finalPosition} of ${total}`,
  dragHandleAriaDescription:
    'Use Space or Enter to activate drag, arrow keys to move, Space or Enter to submit, or Escape to discard.',
  dragHandleAriaLabel: 'Drag handle',
};
