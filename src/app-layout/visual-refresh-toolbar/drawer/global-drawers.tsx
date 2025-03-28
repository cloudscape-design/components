// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

import { createWidgetizedComponent } from '../../../internal/widgets';
import { AppLayoutInternals } from '../interfaces';
import AppLayoutGlobalDrawer from './global-drawer';

interface AppLayoutGlobalDrawersImplementationProps {
  appLayoutInternals: AppLayoutInternals;
}

export function AppLayoutGlobalDrawersImplementation({
  appLayoutInternals,
}: AppLayoutGlobalDrawersImplementationProps) {
  const { globalDrawers, activeGlobalDrawersIds, expandedDrawerId } = appLayoutInternals;
  const openDrawersHistory = useRef<Set<string>>(new Set());

  if (!globalDrawers.length) {
    return <></>;
  }

  return (
    <>
      {globalDrawers
        .filter(
          drawer =>
            activeGlobalDrawersIds.includes(drawer.id) ||
            (drawer.preserveInactiveContent && openDrawersHistory.current.has(drawer.id))
        )
        .map(drawer => {
          openDrawersHistory.current.add(drawer.id);
          return (
            <AppLayoutGlobalDrawer
              key={drawer.id}
              show={expandedDrawerId ? drawer.id === expandedDrawerId : activeGlobalDrawersIds.includes(drawer.id)}
              activeGlobalDrawer={drawer}
              appLayoutInternals={appLayoutInternals}
            />
          );
        })}
    </>
  );
}

export const createWidgetizedAppLayoutGlobalDrawers = createWidgetizedComponent(AppLayoutGlobalDrawersImplementation);
