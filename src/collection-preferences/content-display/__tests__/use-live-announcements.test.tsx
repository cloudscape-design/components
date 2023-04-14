// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import useLiveAnnouncements from '../use-live-announcements';
import { CollectionPreferencesProps } from '../../../../lib/components';
import { render } from '@testing-library/react';
import { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';

const liveAnnouncementDndStarted = jest.fn();
const liveAnnouncementDndItemReordered = jest.fn();
const liveAnnouncementDndItemCommitted = jest.fn();

const i18nStrings: Partial<CollectionPreferencesProps.ContentDisplayPreference> = {
  liveAnnouncementDndStarted,
  liveAnnouncementDndDiscarded: 'Reordering canceled',
  liveAnnouncementDndItemReordered,
  liveAnnouncementDndItemCommitted,
  dragHandleAriaDescription:
    'Use Space or Enter to activate drag, arrow keys to move, Space or Enter to submit, or Escape to discard.',
  dragHandleAriaLabel: 'Drag handle',
};

const sortedOptions: CollectionPreferencesProps.ContentDisplayItem[] = [{ id: 'id2' }, { id: 'id1' }];

const TestComponent = ({ activeId, isDragging, overId }: { activeId: string; isDragging: boolean; overId: string }) => {
  const { onDragStart, onDragOver, onDragEnd, onDragCancel } = useLiveAnnouncements({
    isDragging,
    ...i18nStrings,
    sortedOptions,
  });
  onDragStart({ active: { id: activeId } } as DragStartEvent);
  onDragOver({ active: { id: activeId }, over: { id: overId } } as DragOverEvent);
  onDragEnd({ active: { id: activeId }, over: { id: overId } } as DragEndEvent);
  onDragCancel();
  return null;
};

describe('useLiveAnnouncements', () => {
  beforeEach(() => {
    liveAnnouncementDndStarted.mockClear();
    liveAnnouncementDndItemReordered.mockClear();
    liveAnnouncementDndItemCommitted.mockClear();
  });

  it('calls the provided live announcement functions', () => {
    render(<TestComponent isDragging={true} activeId={'id1'} overId={'id2'} />);
    expect(i18nStrings.liveAnnouncementDndStarted).toHaveBeenCalled();
    expect(i18nStrings.liveAnnouncementDndItemReordered).toHaveBeenCalled();
    expect(i18nStrings.liveAnnouncementDndItemCommitted).toHaveBeenCalled();
  });

  it('onDragOver avoids calling liveAnnouncementDndItemReordered when it is the first call and the active item is over itself', () => {
    const { rerender } = render(<TestComponent isDragging={true} activeId={'id1'} overId={'id1'} />);
    expect(i18nStrings.liveAnnouncementDndItemReordered).not.toHaveBeenCalled();
    rerender(<TestComponent isDragging={true} activeId={'id1'} overId={'id1'} />);
    expect(i18nStrings.liveAnnouncementDndItemReordered).toHaveBeenCalled();
  });
});
