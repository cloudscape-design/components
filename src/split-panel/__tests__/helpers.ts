// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SplitPanelContextProps } from '../../../lib/components/internal/context/split-panel-context';

export const defaultSplitPanelContextProps: SplitPanelContextProps = {
  topOffset: 0,
  bottomOffset: 0,
  leftOffset: 0,
  rightOffset: 0,
  position: 'bottom',
  size: 0,
  relativeSize: 0,
  isOpen: true,
  isForcedPosition: false,
  onResize: jest.fn(),
  onToggle: jest.fn(),
  onPreferencesChange: jest.fn(),
  reportHeaderHeight: jest.fn(),
  setSplitPanelToggle: jest.fn(),
  refs: {
    preferences: { current: null },
    slider: { current: null },
    toggle: { current: null },
  },
};
