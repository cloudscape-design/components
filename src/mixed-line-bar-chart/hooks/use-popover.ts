// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useState } from 'react';

export function usePopover() {
  const [state, setState] = useState<'open' | 'closed' | 'pinned'>('closed');

  const isPopoverOpen = state !== 'closed';
  const isPopoverPinned = state === 'pinned';

  const showPopover = useCallback(() => setState('open'), []);
  const pinPopover = useCallback(() => setState('pinned'), []);
  const dismissPopover = useCallback(() => {
    setState('closed');
  }, []);

  return { isPopoverOpen, isPopoverPinned, showPopover, pinPopover, dismissPopover };
}
