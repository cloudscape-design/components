// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useState } from 'react';
import clsx from 'clsx';

import { findUpUntil } from '@cloudscape-design/component-toolkit/dom';

interface VisualContextProps {
  contextName: string;
  className?: string;
  children: React.ReactNode;
}

const contextMatch = /awsui-context-([\w-]+)/;

function getClassName(element: Element): string {
  return element.getAttribute('class') ?? '';
}

export function useVisualContext(elementRef: React.RefObject<Element | null>) {
  const [value, setValue] = useState('');

  useLayoutEffect(() => {
    if (elementRef.current) {
      const contextParent = findUpUntil(
        // @ts-expect-error The implementation only reads parentElement from the start node before walking HTML ancestors.
        elementRef.current,
        node => !!getClassName(node).match(contextMatch)
      );
      setValue(contextParent ? (getClassName(contextParent).match(contextMatch)?.[1] ?? '') : '');
    }
  }, [elementRef]);

  return value;
}

/**
 * This function returns only the className string needed to apply a
 * visual context to the DOM. It is used by the default export but
 * can also be imported directly for situations where the insertion
 * of a <div> node creates style problems.
 */
export function getVisualContextClassname(contextName: string) {
  return `awsui-context-${contextName}`;
}

export default function VisualContext({ contextName, className, children }: VisualContextProps) {
  return <div className={clsx(getVisualContextClassname(contextName), className)}>{children}</div>;
}
