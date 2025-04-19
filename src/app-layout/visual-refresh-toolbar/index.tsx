// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ScreenreaderOnly from '../../internal/components/screenreader-only';
import { AppLayoutProps } from '../interfaces';
import { AppLayoutVisibilityContext } from './contexts';
import { AppLayoutInternalProps } from './interfaces';
import { useAppLayout } from './internal';
import { SkeletonLayout } from './skeleton';

const AppLayoutVisualRefreshToolbar = React.forwardRef<AppLayoutProps.Ref, AppLayoutInternalProps>(
  (props, forwardRef) => {
    const { breadcrumbs } = props;

    const appLayoutState = useAppLayout(props, forwardRef);
    const { isIntersecting, hasToolbar } = appLayoutState;

    return (
      <AppLayoutVisibilityContext.Provider value={isIntersecting}>
        {/* Rendering a hidden copy of breadcrumbs to trigger their deduplication */}
        {!hasToolbar && breadcrumbs ? <ScreenreaderOnly>{breadcrumbs}</ScreenreaderOnly> : null}
        <SkeletonLayout appLayoutProps={props} appLayoutState={appLayoutState} />
      </AppLayoutVisibilityContext.Provider>
    );
  }
);

export default AppLayoutVisualRefreshToolbar;
