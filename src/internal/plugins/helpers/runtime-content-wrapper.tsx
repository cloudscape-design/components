// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';

import { MountContentContext } from '../controllers/drawers';

type VisibilityCallback = (isVisible: boolean) => void;

interface RuntimeContentWrapperProps {
  mountContent: (container: HTMLElement, mountContent?: MountContentContext) => void;
  unmountContent: (container: HTMLElement) => void;
  isVisible?: boolean;
}

export function RuntimeContentWrapper({ mountContent, unmountContent, isVisible }: RuntimeContentWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const visibilityChangeCallback = useRef<VisibilityCallback | null>(null);

  useEffect(() => {
    const container = ref.current!;
    mountContent(container, {
      onVisibilityChange: cb => {
        visibilityChangeCallback.current = cb;
        return () => {
          visibilityChangeCallback.current = null;
        };
      },
    });
    return () => {
      unmountContent(container);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isVisible === undefined) {
      return;
    }

    visibilityChangeCallback.current?.(isVisible);
  }, [isVisible]);

  return <div ref={ref}></div>;
}
