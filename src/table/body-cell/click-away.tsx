// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useRef } from 'react';
import { useStableEventHandler } from '../../internal/hooks/use-stable-event-handler';
import { nodeBelongs } from '../../internal/utils/node-belongs';

export function useClickAway(onClick: () => void) {
  const awayRef = useRef<any>(null);
  const onClickStable = useStableEventHandler(onClick);
  useEffect(() => {
    function handleClick(event: Event) {
      if (!nodeBelongs(awayRef.current, event.target as HTMLElement)) {
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
