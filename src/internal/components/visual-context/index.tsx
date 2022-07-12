// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useState } from 'react';
import { useAttributesMutationObserver } from '../../hooks/use-mutation-observer';
import { findUpUntil } from '../../utils/dom';

export const useVisualContext = (elementRef: React.RefObject<HTMLElement>) => {
  const contextMatch = /awsui-context-([\w-]+)/;
  const [value, setValue] = useState('');
  useAttributesMutationObserver(elementRef, node => {
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

export default function VisualContext({ contextName, className, children }: VisualContextProps) {
  return <div className={clsx(`awsui-context-${contextName}`, className)}>{children}</div>;
}
