// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
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

export interface FocusLockRef {
  /**
   * Focuses the first element in the component.
   */
  focusFirst(): void;
}

function FocusLock(
  { className, disabled, autoFocus, restoreFocus, children }: FocusLockProps,
  ref: React.Ref<FocusLockRef>
) {
  const returnFocusToRef = useRef<HTMLOrSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

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

  // Captures focus when `autoFocus` is set, and the component is mounted or
  // `disabled` changes from true to false.
  useEffect(() => {
    if (autoFocus && !disabled) {
      returnFocusToRef.current = document.activeElement as HTMLOrSVGElement | null;
      focusFirst();
    }
  }, [autoFocus, disabled]);

  // Restore focus if `restoreFocus` is set, and `disabled` changes from false
  // to true.
  const [previouslyDisabled, setPreviouslyDisabled] = useState(!!disabled);
  useEffect(() => {
    if (previouslyDisabled !== !!disabled) {
      setPreviouslyDisabled(!!disabled);
      if (restoreFocus && disabled) {
        returnFocusToRef.current?.focus();
        returnFocusToRef.current = null;
      }
    }
  }, [previouslyDisabled, disabled, restoreFocus]);

  // Restore focus if `restoreFocus` is set and the component is unmounted.
  // Using a callback ref for this is safer than using useEffect cleanups.
  const restoreFocusHandler = useCallback(
    (elem: HTMLDivElement | null) => {
      if (elem === null && restoreFocus) {
        returnFocusToRef.current?.focus();
        returnFocusToRef.current = null;
      }
    },
    [restoreFocus]
  );

  useImperativeHandle(ref, () => ({ focusFirst }));
  const mergedRef = useMergeRefs(containerRef, restoreFocusHandler);

  return (
    <>
      <TabTrap disabled={disabled} focusNextCallback={focusLast} />
      <div className={className} ref={mergedRef}>
        {children}
      </div>
      <TabTrap disabled={disabled} focusNextCallback={focusFirst} />
    </>
  );
}

export default React.forwardRef(FocusLock);
