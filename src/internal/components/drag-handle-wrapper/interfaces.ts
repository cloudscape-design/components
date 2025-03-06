// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export type Direction = 'block-start' | 'block-end' | 'inline-start' | 'inline-end';
export type DirectionState = 'active' | 'disabled';

export interface DragHandleWrapperProps {
  directions: Partial<Record<Direction, DirectionState>>;
  onDirectionClick?: (direction: Direction) => void;
  resizeTooltipText?: string;
  children: React.ReactNode;
}
