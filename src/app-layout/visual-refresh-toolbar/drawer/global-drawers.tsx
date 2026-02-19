// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

import { InternalErrorBoundary } from '../../../error-boundary/internal';
import { AppLayoutInternals } from '../interfaces';
import AppLayoutGlobalDrawer from './global-drawer';

import styles from './styles.css.js';

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
            (drawer.position !== 'bottom' && activeGlobalDrawersIds.includes(drawer.id)) ||
            (drawer.preserveInactiveContent && openDrawersHistory.current.has(drawer.id))
        )
        .map(drawer => {
          openDrawersHistory.current.add(drawer.id);
          return (
            <InternalErrorBoundary
              className={styles['drawer-error-boundary']}
              key={drawer.id}
              onError={error => console.log('Error boundary for the trigger button: ', error)}
              suppressNested={false}
              suppressible={true}
            >
              <AppLayoutGlobalDrawer
                key={drawer.id}
                show={
                  activeGlobalDrawersIds.includes(drawer.id) && (!expandedDrawerId || drawer.id === expandedDrawerId)
                }
                activeGlobalDrawer={drawer}
                appLayoutInternals={appLayoutInternals}
              />
            </InternalErrorBoundary>
          );
        })}
    </>
  );
}
