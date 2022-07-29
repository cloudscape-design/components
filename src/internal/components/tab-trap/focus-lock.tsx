// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import TabTrap from './index';
import { getFirstFocusable, getLastFocusable } from './utils';

export interface FocusLockProps {
  disabled?: boolean;
  children: React.ReactNode;
}

export default function FocusLock({ disabled, children }: FocusLockProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const focusFirst = () => {
    if (containerRef.current) {
      getFirstFocusable(containerRef.current)?.focus();
    }
  };

  const focusLast = () => {
    if (containerRef.current) {
      getLastFocusable(containerRef.current)?.focus();
    }
  };

  return (
    <>
      <TabTrap disabled={disabled} focusNextCallback={focusLast} />
      <div ref={containerRef}>{children}</div>
      <TabTrap disabled={disabled} focusNextCallback={focusFirst} />
    </>
  );
}
