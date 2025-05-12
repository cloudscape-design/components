// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RefObject, useCallback, useEffect, useState } from 'react';

import { awsuiPluginsInternal } from '../../internal/plugins/api';
import { DrawerConfig } from '../../internal/plugins/controllers/drawers';

export const useRuntimeDrawerContext = ({ rootRef }: { rootRef: RefObject<HTMLElement> }) => {
  const [drawerContext, setDrawerContext] = useState<DrawerConfig | null>(null);

  const getRuntimeDrawerId = useCallback((element: HTMLElement | null): string | null => {
    if (!element) {
      return null;
    }

    const drawerId = (element.parentNode as HTMLElement)?.dataset?.awsuiRuntimeDrawerRootId;

    if (!drawerId) {
      return getRuntimeDrawerId(element.parentElement);
    }

    return drawerId;
  }, []);

  useEffect(() => {
    // Determine if the hook is inside a runtime drawer.
    // There’s no other reliable way to check this, since runtime drawers are separate applications rendered into specific DOM nodes.
    const drawerId = getRuntimeDrawerId(rootRef?.current);

    if (!drawerId) {
      return;
    }

    const drawers = awsuiPluginsInternal.appLayout.getDrawersState();
    setDrawerContext(drawers?.find(drawer => drawer.id === drawerId) ?? null);

    return awsuiPluginsInternal.appLayout.onDrawersUpdated(drawers => {
      setDrawerContext(drawers?.find(drawer => drawer.id === drawerId) ?? null);
    });
  }, [getRuntimeDrawerId, rootRef]);

  return drawerContext;
};
