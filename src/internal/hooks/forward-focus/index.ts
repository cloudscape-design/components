// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle } from 'react';

export interface ForwardFocusRef {
  focus(): void;
}

export default function useForwardFocus(
  mainRef: React.Ref<any>,
  controlRef: React.RefObject<{ focus: HTMLElement['focus'] }>
) {
  useImperativeHandle(
    mainRef,
    () => ({
      focus(...args: Parameters<HTMLElement['focus']>) {
        controlRef.current?.focus(...args);
      },
    }),
    [controlRef]
  );
}
