// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  container?: null | Element;
  children: React.ReactNode;
}

/**
 * A safe react portal component that renders to a provided node.
 * If a node isn't provided, it creates one under document.body.
 */
export default function Portal({ container, children }: PortalProps) {
  const [activeContainer, setActiveContainer] = useState<Element | null>(container ?? null);

  useLayoutEffect(() => {
    if (container) {
      setActiveContainer(container);
      return;
    }
    const newContainer = document.createElement('div');
    document.body.appendChild(newContainer);
    setActiveContainer(newContainer);
    return () => {
      document.body.removeChild(newContainer);
      setActiveContainer(null);
    };
  }, [container]);

  return activeContainer && createPortal(children, activeContainer);
}
