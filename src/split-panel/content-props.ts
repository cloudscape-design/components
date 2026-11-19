// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';

/** Props the split panel implementation passes to its bottom/side content renderers. Not public API. */
export interface SplitPanelContentProps {
  style: React.CSSProperties;
  baseProps: BaseComponentProps;
  isOpen?: boolean;
  splitPanelRef?: React.Ref<any>;
  cappedSize: number;
  panelHeaderId?: string;
  ariaLabel?: string;
  resizeHandle: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
  onToggle: () => void;
}
