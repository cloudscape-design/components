// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { AppLayoutInternalProps, AppLayoutPendingState } from '../interfaces';
import { ToolbarProps } from '../toolbar';

interface ElementAttributes {
  className?: string;
  style?: React.CSSProperties;
}

export interface SkeletonSlotsAttributes {
  wrapperElAttributes?: ElementAttributes;
  mainElAttributes?: ElementAttributes;
  contentWrapperElAttributes?: ElementAttributes;
  contentHeaderElAttributes?: ElementAttributes;
  contentElAttributes?: ElementAttributes;
}

export interface SkeletonPartProps {
  appLayoutProps: AppLayoutInternalProps;
  toolbarProps: ToolbarProps | null;
  appLayoutState: AppLayoutPendingState;
}
