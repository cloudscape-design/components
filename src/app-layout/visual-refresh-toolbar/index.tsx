// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import ScreenreaderOnly from '../../internal/components/screenreader-only';
import { AppLayoutProps } from '../interfaces';
import { AppLayoutVisibilityContext } from './contexts';
import { AppLayoutInternalProps } from './interfaces';
import { AppLayoutState } from './internal';
import { createHtmlPortalNode, HtmlPortalNode, InPortal, OutPortal } from './reverse-portal';
import { SkeletonLayout } from './skeleton';
import { useSkeletonSlotsAttributes } from './skeleton/widget-slots/use-skeleton-slots-attributes';
import { useAppLayout } from './use-app-layout';

const AppLayoutStateParent = (props: {
  children: (
    state: ReturnType<typeof useAppLayout>,
    skeletonSlotsAttributes: ReturnType<typeof useSkeletonSlotsAttributes>
  ) => React.ReactNode;
  node: HtmlPortalNode;
  stateMounted: boolean;
}) => {
  if (!props.stateMounted) {
    return <>{props.children({} as any, {} as any)}</>;
  }

  return <OutPortal {...props} />;
};

const AppLayoutVisualRefreshToolbar = React.forwardRef<AppLayoutProps.Ref, AppLayoutInternalProps>(
  (props, forwardRef) => {
    const [stateMounted, setStateMounted] = useState(false);
    const portalNode = React.useMemo(() => (typeof window !== 'undefined' ? createHtmlPortalNode() : null), []);

    return (
      <>
        <InPortal node={portalNode!}>
          <AppLayoutState props={props} forwardRef={forwardRef} onMount={() => setStateMounted(true)}>
            {() => <></>}
          </AppLayoutState>
        </InPortal>
        <AppLayoutStateParent node={portalNode!} stateMounted={stateMounted}>
          {(appLayoutState, skeletonSlotsAttributes) => {
            return (
              <AppLayoutVisibilityContext.Provider value={appLayoutState?.isIntersecting ?? true}>
                {/* Rendering a hidden copy of breadcrumbs to trigger their deduplication */}
                {!appLayoutState?.hasToolbar && props.breadcrumbs ? (
                  <ScreenreaderOnly>{props.breadcrumbs}</ScreenreaderOnly>
                ) : null}

                <SkeletonLayout
                  appLayoutProps={props}
                  appLayoutState={appLayoutState}
                  skeletonSlotsAttributes={skeletonSlotsAttributes}
                />
              </AppLayoutVisibilityContext.Provider>
            );
          }}
        </AppLayoutStateParent>
      </>
    );
  }
);

export default AppLayoutVisualRefreshToolbar;
