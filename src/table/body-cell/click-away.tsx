// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import { containsOrEqual, findUpUntil } from '../../internal/utils/dom';
import { useStableEventHandler } from '../../internal/hooks/use-stable-event-handler';

// TODO: reuse this one or the detection part
export function useClickAway(onClick: () => void) {
  const awayRef = useRef<any>(null);
  const onClickStable = useStableEventHandler(onClick);
  useEffect(() => {
    function handleClick(event: Event) {
      // TODO: should we use awsui data prop name or first find the portal using a class name?
      const portal = findUpUntil(event.target as HTMLElement, node => !!node.dataset.awsuiReferrerId);
      const referrer = portal ? document.getElementById(portal.dataset.awsuiReferrerId ?? '') : null;

      if (
        !containsOrEqual(awayRef.current, event.target as Node) &&
        referrer &&
        !containsOrEqual(awayRef.current, referrer)
      ) {
        onClickStable();
      }
    }
    // contains returns wrong result if the next render would remove the element
    // but capture phase happens before the render, so returns correct result
    // Ref: https://github.com/facebook/react/issues/20325
    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, [onClickStable]);
  return awayRef;
}

interface ClickAwayActive {
  onClick: () => void;
  children: React.ReactNode;
}

// TODO: this one is only used in tests, remove
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
