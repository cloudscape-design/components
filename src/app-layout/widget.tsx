// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { getGlobalFlag } from '../internal/utils/global-flags';
import { AppLayoutProps, AppLayoutPropsWithDefaults } from './interfaces';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { AppLayoutImplementation } from './implementation';

type AppLayoutType = React.ForwardRefExoticComponent<
  AppLayoutPropsWithDefaults & React.RefAttributes<AppLayoutProps.Ref>
>;

export function createWidgetizedAppLayout(AppLayoutLoader?: AppLayoutType): AppLayoutType {
  return React.forwardRef((props, ref) => {
    const isRefresh = useVisualRefresh();
    if (isRefresh && getGlobalFlag('appLayoutWidget') && AppLayoutLoader) {
      return <AppLayoutLoader ref={ref} {...props} />;
    }

    return <AppLayoutImplementation ref={ref} {...props} />;
  });
}
