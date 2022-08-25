// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import FocusDetector from '../focus-detector';
import { getFirstTabbable, getLastTabbable } from '../../utils/tabbables';

export interface FocusLockProps {
  disabled?: boolean;
  autoFocus?: boolean;
  children: React.ReactNode;
}

export default function FocusLock({ disabled, autoFocus, children }: FocusLockProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const focusFirst = () => {
    if (containerRef.current) {
      getFirstTabbable(containerRef.current)?.focus();
    }
  };

  const focusLast = () => {
    if (containerRef.current) {
      getLastTabbable(containerRef.current)?.focus();
    }
  };

  useEffect(() => {
    if (autoFocus) {
      focusFirst();
    }
  }, [autoFocus]);

  return (
    <>
      <FocusDetector disabled={disabled} onFocus={focusLast} />
      <div ref={containerRef}>{children}</div>
      <FocusDetector disabled={disabled} onFocus={focusFirst} />
    </>
  );
}
