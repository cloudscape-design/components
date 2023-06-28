// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CollectionPreferencesProps } from '../interfaces';
import { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { useRef } from 'react';

export default function useLiveAnnouncements({
  isDragging,
  liveAnnouncementDndStarted,
  liveAnnouncementDndItemReordered,
  liveAnnouncementDndItemCommitted,
  liveAnnouncementDndDiscarded,
  sortedOptions,
}: Partial<CollectionPreferencesProps.ContentDisplayPreference> & {
  isDragging: boolean;
  sortedOptions: ReadonlyArray<CollectionPreferencesProps.ContentDisplayItem>;
}) {
  const isFirstAnnouncement = useRef(true);
  if (!isDragging) {
    isFirstAnnouncement.current = true;
  }

  return {
    onDragStart({ active }: DragStartEvent) {
      if (active && liveAnnouncementDndStarted) {
        const index = sortedOptions.findIndex(option => option.id === active.id);
        return liveAnnouncementDndStarted(index + 1, sortedOptions.length);
      }
    },
    onDragOver({ active, over }: DragOverEvent) {
      if (liveAnnouncementDndItemReordered) {
        // Don't announce on the first dragOver because it's redundant with onDragStart.
        if (isFirstAnnouncement.current) {
          isFirstAnnouncement.current = false;
          if (!over || over.id === active.id) {
            return;
          }
        }
        const initialIndex = sortedOptions.findIndex(option => option.id === active.id);
        const currentIdex = over ? sortedOptions.findIndex(option => option.id === over.id) : initialIndex;
        return liveAnnouncementDndItemReordered(initialIndex + 1, currentIdex + 1, sortedOptions.length);
      }
    },
    onDragEnd({ active, over }: DragEndEvent) {
      if (liveAnnouncementDndItemCommitted) {
        const initialIndex = sortedOptions.findIndex(option => option.id === active.id);
        const finalIndex = over ? sortedOptions.findIndex(option => option.id === over.id) : initialIndex;
        return liveAnnouncementDndItemCommitted(initialIndex + 1, finalIndex + 1, sortedOptions.length);
      }
    },
    onDragCancel() {
      return liveAnnouncementDndDiscarded;
    },
  };
}
