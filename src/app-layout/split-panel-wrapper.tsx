// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { SplitPanelContext, SplitPanelContextProps } from '../internal/context/split-panel-context';

interface SplitPanelWrapperProps {
  context: SplitPanelContextProps;
  children: React.ReactNode;
  isCopy?: boolean;
}

export function SplitPanelWrapper({ context, children, isCopy }: SplitPanelWrapperProps) {
  if (!children) {
    return null;
  }
  return <SplitPanelContext.Provider value={{ ...context, isCopy }}>{children}</SplitPanelContext.Provider>;
}
