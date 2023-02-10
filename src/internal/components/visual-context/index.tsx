// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useState } from 'react';
import { useMutationObserver } from '../../hooks/use-mutation-observer';
import { findUpUntil } from '../../utils/dom';

export const useVisualContext = (elementRef: React.RefObject<HTMLElement>) => {
  const contextMatch = /awsui-context-([\w-]+)/;
  const [value, setValue] = useState('');
  useMutationObserver(elementRef, node => {
    const contextParent = findUpUntil(node, node => !!node.className.match(contextMatch));
    setValue(contextParent ? contextParent.className.match(contextMatch)![1] : '');
  });
  return value;
};

interface VisualContextProps {
  contextName: string;
  className?: string;
  children: React.ReactNode;
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
