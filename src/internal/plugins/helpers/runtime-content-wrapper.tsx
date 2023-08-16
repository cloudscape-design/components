// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';

interface RuntimeContentWrapperProps {
  mountContent: (container: HTMLElement) => void;
  unmountContent: (container: HTMLElement) => void;
}

export function RuntimeContentWrapper({ mountContent, unmountContent }: RuntimeContentWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current!;
    mountContent(container);
    return () => unmountContent(container);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={ref}></div>;
}
