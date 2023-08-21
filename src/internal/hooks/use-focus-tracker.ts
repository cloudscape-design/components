// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useRef, useEffect, MutableRefObject } from 'react';
import { NonCancelableEventHandler, fireNonCancelableEvent } from '../events';
import FocusTracker from '../focus-tracker';

interface UseFocusTracker {
  (inputProps: {
    onBlur?: NonCancelableEventHandler<any>;
    onFocus?: NonCancelableEventHandler<any>;
    rootRef: MutableRefObject<HTMLElement | null>;
  }): void;
}

export const useFocusTracker: UseFocusTracker = ({ rootRef, onBlur, onFocus }) => {
  const focusTracker = useRef<FocusTracker | null>(null);

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }
    focusTracker.current = new FocusTracker(rootRef.current, {
      onFocusLeave: () => {
        fireNonCancelableEvent(onBlur);
      },
      onFocusEnter: () => {
        fireNonCancelableEvent(onFocus);
      },
    });
    focusTracker.current.initialize();
    return () => {
      focusTracker.current?.destroy();
    };
  }, [rootRef, onBlur, onFocus]);
};
