// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

import { TOOLS_DRAWER_ID } from '../../utils/use-drawers';
import { AppLayoutInternals } from '../interfaces';
import { AppLayoutDrawerImplementation as AppLayoutDrawer } from './local-drawer';

interface AppLayoutDrawersImplementationProps {
  appLayoutInternals: AppLayoutInternals;
  bottomDrawerReportedSize?: number;
}

export function AppLayoutDrawersImplementation({
  appLayoutInternals,
  bottomDrawerReportedSize,
}: AppLayoutDrawersImplementationProps) {
  const { drawers, activeDrawer } = appLayoutInternals;
  const openDrawersHistory = useRef<Set<string>>(new Set());

  if (!drawers.length) {
    return <></>;
  }

  return (
    <>
      {drawers
        .filter(
          drawer =>
            drawer.id === TOOLS_DRAWER_ID ||
            drawer.id === activeDrawer?.id ||
            (drawer.preserveInactiveContent && openDrawersHistory.current.has(drawer.id))
        )
        .map(drawer => {
          openDrawersHistory.current.add(drawer.id);
          return (
            <AppLayoutDrawer
              key={drawer.id}
              drawer={drawer}
              appLayoutInternals={appLayoutInternals}
              bottomDrawerReportedSize={bottomDrawerReportedSize}
            />
          );
        })}
    </>
  );
}
