// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMergeRefs } from '../../hooks/use-merge-refs';

import TabTrap from '../tab-trap/index';
import { getFirstFocusable, getLastFocusable } from './utils';

export interface FocusLockProps {
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;
  children: React.ReactNode;
}

export default function FocusLock({ className, disabled, autoFocus, restoreFocus, children }: FocusLockProps) {
  const returnFocusToRef = useRef<HTMLOrSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Using a callback ref to detect component unmounts, which is safer than using useEffect.
  const restoreFocusHandler = useCallback(
    (elem: HTMLDivElement | null) => {
      if (elem === null && restoreFocus) {
        returnFocusToRef.current?.focus();
      }
    },
    [restoreFocus]
  );

  const mergedRef = useMergeRefs(containerRef, restoreFocusHandler);

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

  useEffect(() => {
    if (autoFocus && !disabled) {
      returnFocusToRef.current = document.activeElement as HTMLOrSVGElement | null;
      focusFirst();
    }
  }, [autoFocus, disabled]);

  // Returns focus when disabled changes from false to true.
  const [prevDisabled, setPrevDisabled] = useState(!!disabled);
  useEffect(() => {
    if (prevDisabled !== !!disabled) {
      setPrevDisabled(!!disabled);
      if (disabled && restoreFocus) {
        returnFocusToRef.current?.focus();
        returnFocusToRef.current = null;
      }
    }
  }, [prevDisabled, disabled, restoreFocus]);

  return (
    <>
      <TabTrap disabled={disabled} onFocus={focusLast} />
      <div className={className} ref={mergedRef}>
        {children}
      </div>
      <TabTrap disabled={disabled} onFocus={focusFirst} />
    </>
  );
}
