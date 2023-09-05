// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import { ActionButtonsController, ActionConfig, ActionContext } from '../controllers/action-buttons';
import { RuntimeContentWrapper } from './runtime-content-wrapper';

function convertRuntimeAction(action: ActionConfig | null, context: ActionContext) {
  if (!action) {
    return null;
  }
  return (
    <RuntimeContentWrapper
      key={action.id + '-' + context.type}
      mountContent={container => action.mountContent(container, context)}
      unmountContent={container => action.unmountContent(container)}
    />
  );
}

export function createUseDiscoveredAction(onActionRegistered: ActionButtonsController['onActionRegistered']) {
  return function useDiscoveredAction(type: string) {
    const [discoveredActions, setDiscoveredActions] = useState<Array<React.ReactNode>>([]);
    const headerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      return onActionRegistered(actions => {
        setDiscoveredActions(actions.map(action => convertRuntimeAction(action, { type, headerRef, contentRef })));
      });
    }, [type]);

    return { discoveredActions, headerRef, contentRef };
  };
}
