// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import { containsOrEqual } from '../../internal/utils/dom';
import { useStableEventHandler } from '../../internal/hooks/use-stable-event-handler';

export function useClickAway(onClick: () => void) {
  const awayRef = useRef<any>(null);
  const onClickStable = useStableEventHandler(onClick);
  useEffect(() => {
    function handleClick(event: Event) {
      if (!containsOrEqual(awayRef.current, event.target as Node)) {
        onClickStable();
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [onClickStable]);
  return awayRef;
}

interface ClickAwayActive {
  onClick: () => void;
  children: React.ReactNode;
}
export function ClickAway({ onClick, children }: ClickAwayActive) {
  const onClickStable = useStableEventHandler(onClick);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    function handleClick(event: Event) {
      if (!containsOrEqual(ref.current, event.target as Node)) {
        onClickStable();
      }
    }
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [onClickStable]);
  return <span ref={ref}>{children}</span>;
}
