// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';

type VisibilityCallback = (isVisible: boolean) => void;

interface RuntimeContentWrapperProps {
  mountContent: (container: HTMLElement, visibilityCallback?: (callback: VisibilityCallback) => () => void) => void;
  unmountContent: (container: HTMLElement) => void;
  registerVisibilityCallback?: (callback: VisibilityCallback) => () => void;
}

export function RuntimeContentWrapper({
  mountContent,
  unmountContent,
  registerVisibilityCallback,
}: RuntimeContentWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current!;
    mountContent(container, registerVisibilityCallback);
    return () => {
      unmountContent(container);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={ref}></div>;
}
