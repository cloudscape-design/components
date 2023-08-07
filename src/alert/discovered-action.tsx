// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import { ActionConfig, ActionContext } from '../internal/plugins/action-buttons-controller';
import { awsuiPluginsInternal } from '../internal/plugins/api';

interface RuntimeContentWrapperProps {
  mountContent: (container: HTMLElement) => void;
  unmountContent: (container: HTMLElement) => void;
}

function RuntimeContentWrapper({ mountContent, unmountContent }: RuntimeContentWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current!;
    mountContent(container);
    return () => unmountContent(container);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={ref}></div>;
}

function convertRuntimeAction(action: ActionConfig | null, context: ActionContext) {
  if (!action) {
    return null;
  }
  return (
    <RuntimeContentWrapper
      mountContent={container => action.mountContent(container, context)}
      unmountContent={container => action.unmountContent(container)}
    />
  );
}

export function useDiscoveredAction(type: string) {
  const [discoveredAction, setDiscoveredAction] = useState<React.ReactElement | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return awsuiPluginsInternal.alert.onActionRegistered(action => {
      setDiscoveredAction(convertRuntimeAction(action, { type, headerRef, contentRef }));
    });
  }, [type]);

  return { discoveredAction, headerRef, contentRef };
}
