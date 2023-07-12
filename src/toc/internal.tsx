// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';
import { TocProps } from './interfaces';

export default function InternalToc({ ...props }: TocProps) {
  const className = clsx(styles.root);
  return <div className={className}>{props.title}</div>;
}
