// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { getGlobalFlag } from '../internal/utils/global-flags';
import { SplitPanelProps } from './interfaces';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { SplitPanelImplementation } from './implementation';

type SplitPanelType = React.ForwardRefExoticComponent<SplitPanelProps & React.RefAttributes<HTMLElement>>;

export function createWidgetizedSplitPanel(SplitPanelLoader?: SplitPanelType): SplitPanelType {
  return React.forwardRef((props, ref) => {
    const isRefresh = useVisualRefresh();
    if (isRefresh && getGlobalFlag('appLayoutWidget') && SplitPanelLoader) {
      return <SplitPanelLoader ref={ref} {...props} />;
    }

    return <SplitPanelImplementation ref={ref} {...props} />;
  });
}
