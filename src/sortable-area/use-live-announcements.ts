// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useRef } from 'react';
import { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';

import { SortableAreaProps } from './interfaces';

export default function useLiveAnnouncements<Item>({
  items,
  itemDefinition,
  isDragging,
  liveAnnouncementDndStarted,
  liveAnnouncementDndItemReordered,
  liveAnnouncementDndItemCommitted,
  liveAnnouncementDndDiscarded,
}: {
  items: readonly Item[];
  itemDefinition: SortableAreaProps.ItemDefinition<Item>;
  isDragging: boolean;
} & SortableAreaProps.DndAreaI18nStrings) {
  const isFirstAnnouncement = useRef(true);
  if (!isDragging) {
    isFirstAnnouncement.current = true;
  }

  return {
    onDragStart({ active }: DragStartEvent) {
      if (active && liveAnnouncementDndStarted) {
        const index = items.findIndex(item => itemDefinition.id(item) === active.id);
        return liveAnnouncementDndStarted(index + 1, items.length);
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
        const initialIndex = items.findIndex(item => itemDefinition.id(item) === active.id);
        const currentIdex = over ? items.findIndex(item => itemDefinition.id(item) === over.id) : initialIndex;
        return liveAnnouncementDndItemReordered(initialIndex + 1, currentIdex + 1, items.length);
      }
    },
    onDragEnd({ active, over }: DragEndEvent) {
      if (liveAnnouncementDndItemCommitted) {
        const initialIndex = items.findIndex(item => itemDefinition.id(item) === active.id);
        const finalIndex = over ? items.findIndex(item => itemDefinition.id(item) === over.id) : initialIndex;
        return liveAnnouncementDndItemCommitted(initialIndex + 1, finalIndex + 1, items.length);
      }
    },
    onDragCancel() {
      return liveAnnouncementDndDiscarded;
    },
  };
}
