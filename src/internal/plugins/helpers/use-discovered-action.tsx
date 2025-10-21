// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import { ActionButtonsController, ActionConfig, ActionContext } from '../controllers/action-buttons';

interface RuntimeActionWrapperProps {
  context: ActionContext;
  mountContent: ActionConfig['mountContent'];
  updateContent: ActionConfig['updateContent'];
  unmountContent: ActionConfig['unmountContent'];
}

function RuntimeActionWrapper({ mountContent, updateContent, unmountContent, context }: RuntimeActionWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current && ref.current) {
      updateContent?.(ref.current, context);
    }
  });

  useEffect(() => {
    const container = ref.current!;
    mountContent(container, context);
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      unmountContent(container);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={ref}></div>;
}

export function createUseDiscoveredAction(onActionRegistered: ActionButtonsController['onActionRegistered']) {
  return function useDiscoveredAction(type: string): {
    discoveredActions: React.ReactNode[];
    headerRef: React.Ref<HTMLDivElement>;
    contentRef: React.Ref<HTMLDivElement>;
  } {
    const [actionConfigs, setActionConfigs] = useState<Array<ActionConfig>>([]);
    const headerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      return onActionRegistered(actions => setActionConfigs(actions));
    }, [type]);

    const discoveredActions = actionConfigs.map(action => (
      <RuntimeActionWrapper
        key={action.id + '-' + type}
        context={{
          type,
          headerRef,
          contentRef,
        }}
        mountContent={action.mountContent}
        updateContent={action.updateContent}
        unmountContent={action.unmountContent}
      />
    ));

    return { discoveredActions, headerRef, contentRef };
  };
}
