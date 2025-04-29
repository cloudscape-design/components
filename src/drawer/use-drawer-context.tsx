// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useState } from 'react';

import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { awsuiPluginsInternal } from '../internal/plugins/api';
import { DrawerConfig } from '../internal/plugins/controllers/drawers';

export const useRuntimeDrawerContext = ({ __internalRootRef }: InternalBaseComponentProps) => {
  const [drawerContext, setDrawerContext] = useState<DrawerConfig | null>(null);

  useEffect(() => {
    // Determine if the drawer is inside a runtime drawer.
    // There’s no other reliable way to check this, since runtime drawers are separate applications rendered into specific DOM nodes.
    const drawerId = __internalRootRef?.current?.parentNode?.dataset?.drawerId;

    if (!drawerId) {
      return;
    }

    const drawers = awsuiPluginsInternal.appLayout.getDrawersState();
    setDrawerContext(drawers?.find(drawer => drawer.id === drawerId) ?? null);

    return awsuiPluginsInternal.appLayout.onDrawersUpdated(drawers => {
      setDrawerContext(drawers?.find(drawer => drawer.id === drawerId) ?? null);
    });
  }, [__internalRootRef]);

  return drawerContext;
};
