// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useState } from 'react';
import clsx from 'clsx';

import { findUpUntil } from '../../utils/dom';

interface VisualContextProps {
  contextName: string;
  className?: string;
  children: React.ReactNode;
}

const contextMatch = /awsui-context-([\w-]+)/;

export function useVisualContext(elementRef: React.RefObject<HTMLElement>) {
  const [value, setValue] = useState('');

  useLayoutEffect(() => {
    if (elementRef.current) {
      const contextParent = findUpUntil(elementRef.current, node => !!node.className.match(contextMatch));
      setValue(contextParent?.className.match(contextMatch)![1] ?? '');
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
