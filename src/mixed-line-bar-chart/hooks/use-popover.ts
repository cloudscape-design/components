// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useRef, useState } from 'react';

// The delay prevents re-opening popover immediately upon dismissing,
// so that the popover actually closes. It can be reopened with the next
// hover or focus event that occurs after the delay.
const REOPEN_DELAY_MS = 50;

export function usePopover() {
  const dismissedTimeRef = useRef(Date.now() - REOPEN_DELAY_MS);
  const [state, setState] = useState<'open' | 'closed' | 'pinned'>('closed');

  const isPopoverOpen = state !== 'closed';
  const isPopoverPinned = state === 'pinned';

  const showPopover = useCallback(() => {
    if (Date.now() - dismissedTimeRef.current > REOPEN_DELAY_MS) {
      setState('open');
    }
  }, []);
  const pinPopover = useCallback(() => setState('pinned'), []);
  const hidePopover = useCallback(() => setState('closed'), []);
  const dismissPopover = useCallback(() => {
    setState(prev => {
      if (prev === 'pinned') {
        dismissedTimeRef.current = Date.now();
      }
      return 'closed';
    });
  }, []);

  return { isPopoverOpen, isPopoverPinned, showPopover, pinPopover, hidePopover, dismissPopover };
}
