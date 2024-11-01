// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import { ActionButtonsController, ActionConfig, ActionContext } from '../controllers/action-buttons';

interface RuntimeActionWrapperProps {
  context: ActionContext;
  mountContent: ActionConfig['mountContent'];
  unmountContent: ActionConfig['unmountContent'];
}

function RuntimeActionWrapper({ mountContent, unmountContent, context }: RuntimeActionWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current!;
    mountContent(container, context);
    return () => {
      unmountContent(container);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={ref}></div>;
}

function convertRuntimeAction(action: ActionConfig | null, context: ActionContext) {
  if (!action) {
    return null;
  }
  return (
    <RuntimeActionWrapper
      key={action.id + '-' + context.type}
      context={context}
      mountContent={action.mountContent}
      unmountContent={action.unmountContent}
    />
  );
}

export function createUseDiscoveredAction(onActionRegistered: ActionButtonsController['onActionRegistered']) {
  return function useDiscoveredAction(type: string): {
    discoveredActions: React.ReactNode[];
    headerRef: React.Ref<HTMLDivElement>;
    contentRef: React.Ref<HTMLDivElement>;
  } {
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
