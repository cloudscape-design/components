// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Box, Button, SortableAreaProps, SpaceBetween, StatusIndicator } from '~components';

import { Instance } from '../table/generate-data';
import { stateToStatusIndicator } from '../table/shared-configs';

export const i18nStrings: SortableAreaProps<unknown>['i18nStrings'] = {
  dragHandleAriaLabel: 'Drag handle',
  dragHandleAriaDescription:
    "Use Space or Enter to activate drag for an item, then use the arrow keys to move the item's position. To complete the position move, use Space or Enter, or to discard the move, use Escape.",
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
};

export function Status(props: Instance) {
  return <StatusIndicator {...stateToStatusIndicator[props.state]} />;
}

export function DnsName(props: Instance) {
  return props.state === 'RUNNING' && props.dnsName ? (
    <Box color="text-body-secondary" fontSize="body-s">
      {props.dnsName}
    </Box>
  ) : null;
}

export function ArrowButtons({
  disabledUp,
  disabledDown,
  onMoveUp,
  onMoveDown,
}: {
  disabledUp?: boolean;
  disabledDown?: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <SpaceBetween size="xxxs" direction="horizontal">
      <Button disabled={disabledUp} onClick={onMoveUp} variant="icon" ariaLabel="Move up" iconName="caret-up-filled" />
      <Button
        disabled={disabledDown}
        onClick={onMoveDown}
        variant="icon"
        ariaLabel="Move down"
        iconName="caret-down-filled"
      />
    </SpaceBetween>
  );
}
