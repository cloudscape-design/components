// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { HTMLAttributes, ForwardedRef, PointerEvent, forwardRef } from 'react';
import styles from './styles.css.js';

function Handle(props: HTMLAttributes<HTMLDivElement>, ref: ForwardedRef<HTMLDivElement>) {
  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) {
      return;
    }
    props.onPointerDown?.(event);
  }

  // We need to use a div with button role instead of a button
  // so that Safari will focus on it when clicking it.
  // (See https://bugs.webkit.org/show_bug.cgi?id=22261)
  // Otherwise, we can't reliably catch keyboard events coming from the handle
  // when it is being dragged.

  return (
    <div
      role="button"
      tabIndex={0}
      {...props}
      onPointerDown={handlePointerDown}
      className={clsx(styles.handle, props.className)}
      ref={ref}
    />
  );
}

export default forwardRef(Handle);
