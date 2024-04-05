// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { isDevelopment } from '../../is-development';

export interface PortalProps {
  container?: null | Element;
  getContainer?: () => Promise<HTMLElement>;
  removeContainer?: (container: HTMLElement) => void;
  children: React.ReactNode;
}

function manageDefaultContainer(setState: React.Dispatch<React.SetStateAction<Element | null>>) {
  const newContainer = document.createElement('div');
  document.body.appendChild(newContainer);
  setState(newContainer);
  return () => {
    document.body.removeChild(newContainer);
  };
}

function manageAsyncContainer(
  getContainer: () => Promise<HTMLElement>,
  removeContainer: (container: HTMLElement) => void,
  setState: React.Dispatch<React.SetStateAction<Element | null>>
) {
  let newContainer: HTMLElement;
  getContainer().then(
    container => {
      newContainer = container;
      setState(container);
    },
    error => {
      console.warn('[AwsUi] [portal]: failed to load portal root', error);
    }
  );
  return () => {
    removeContainer(newContainer);
  };
}

/**
 * A safe react portal component that renders to a provided node.
 * If a node isn't provided, it creates one under document.body.
 */
export default function Portal({ container, getContainer, removeContainer, children }: PortalProps) {
  const [activeContainer, setActiveContainer] = useState<Element | null>(container ?? null);

  useLayoutEffect(() => {
    if (container) {
      setActiveContainer(container);
      return;
    }
    if (isDevelopment) {
      if (getContainer && !removeContainer) {
        warnOnce('portal', '`removeContainer` is required when `getContainer` is provided');
      }
      if (!getContainer && removeContainer) {
        warnOnce('portal', '`getContainer` is required when `removeContainer` is provided');
      }
    }

    if (getContainer && removeContainer) {
      return manageAsyncContainer(getContainer, removeContainer, setActiveContainer);
    }
    return manageDefaultContainer(setActiveContainer);
  }, [container, getContainer, removeContainer]);

  return activeContainer && createPortal(children, activeContainer);
}
