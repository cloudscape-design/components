// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ButtonHTMLAttributes } from 'react';

import Handle from '../handle';
import InternalIcon from '../../../icon/internal';
import styles from './styles.css.js';
import handleStyles from '../handle/styles.css.js';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import clsx from 'clsx';

export interface DragHandleProps {
  attributes: ButtonHTMLAttributes<HTMLDivElement>;
  hideFocus?: boolean;
  listeners?: SyntheticListenerMap;
}

export default function DragHandle({ attributes, hideFocus, listeners }: DragHandleProps) {
  return (
    <Handle className={clsx(styles.handle, hideFocus && handleStyles['hide-focus'])} {...attributes} {...listeners}>
      <InternalIcon name="drag-indicator" />
    </Handle>
  );
}
