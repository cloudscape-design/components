// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RefObject, useEffect, useState } from 'react';

import { findUpUntil } from '@cloudscape-design/component-toolkit/dom';

import { awsuiPluginsInternal } from '../../internal/plugins/api';
import { DrawerConfig } from '../../internal/plugins/controllers/drawers';

export const useRuntimeDrawerContext = ({ rootRef }: { rootRef: RefObject<HTMLElement> }) => {
  const [drawerContext, setDrawerContext] = useState<DrawerConfig | null>(null);

  useEffect(() => {
    // Determine if the hook is inside a runtime drawer.
    // There’s no other reliable way to check this, since runtime drawers are separate applications rendered into specific DOM nodes.
    if (!rootRef?.current) {
      return;
    }
    const runtimeDrawerWrapper = findUpUntil(rootRef?.current, node => !!node?.dataset?.awsuiRuntimeDrawerRootId);
    const drawerId = runtimeDrawerWrapper?.dataset?.awsuiRuntimeDrawerRootId;

    if (!drawerId) {
      return;
    }

    const drawers = awsuiPluginsInternal.appLayout.getDrawersState();
    setDrawerContext(drawers?.find(drawer => drawer.id === drawerId) ?? null);

    return awsuiPluginsInternal.appLayout.onDrawersUpdated(drawers => {
      setDrawerContext(drawers?.find(drawer => drawer.id === drawerId) ?? null);
    });
  }, [rootRef]);

  return drawerContext;
};
