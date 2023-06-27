// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './styles.css.js';

export interface PortalProps {
  container?: Element;
  referrerId?: string;
  children: React.ReactNode;
}

/**
 * A safe react portal component that renders to a provided node.
 * If a node isn't provided, it creates one under document.body.
 */
export default function Portal({ container, referrerId, children }: PortalProps) {
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

  return (
    activeContainer &&
    createPortal(
      <div className={styles.portal} data-awsui-referrer-id={referrerId}>
        {children}
      </div>,
      activeContainer
    )
  );
}
