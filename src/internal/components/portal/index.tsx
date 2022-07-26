// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect';

export interface PortalProps {
  container?: Element;
  children: React.ReactNode;
}

/**
 * A safe react portal component that renders to a provided node.
 * If a node isn't provided, it creates one under document.body.
 */
export default function Portal({ container, children }: PortalProps) {
  const [activeContainer, setActiveContainer] = useState<Element | null>(container ?? null);

  useIsomorphicLayoutEffect(() => {
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
