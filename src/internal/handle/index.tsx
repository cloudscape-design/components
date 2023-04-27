// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { HTMLAttributes } from 'react';
import styles from './styles.css.js';

export default function Handle(props: HTMLAttributes<HTMLDivElement>) {
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
      onPointerDown={props.onPointerDown}
      className={clsx(styles.handle, props.className)}
    />
  );
}
