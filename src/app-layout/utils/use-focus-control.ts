// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useLayoutEffect, useRef } from 'react';
import { ButtonProps } from '../../button/interfaces';

export function useFocusControl(isOpen?: boolean) {
  const toggleRef = useRef<ButtonProps.Ref>(null);
  const closeRef = useRef<ButtonProps.Ref>(null);

  useLayoutEffect(() => {
    if (isOpen) {
      closeRef.current?.focus();
    } else {
      toggleRef.current?.focus();
    }
  }, [isOpen]);

  return { toggle: toggleRef, close: closeRef };
}
