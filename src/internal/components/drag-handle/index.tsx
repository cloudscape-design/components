// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ButtonHTMLAttributes } from 'react';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import clsx from 'clsx';

import InternalIcon from '../../../icon/internal';
import Handle from '../handle';

import handleStyles from '../handle/styles.css.js';
import styles from './styles.css.js';

export interface DragHandleProps {
  attributes: ButtonHTMLAttributes<HTMLDivElement>;
  hideFocus?: boolean;
  listeners?: SyntheticListenerMap;
  disabled?: boolean;
}

export default function DragHandle({ attributes, hideFocus, listeners, disabled }: DragHandleProps) {
  return (
    <Handle className={clsx(styles.handle, hideFocus && handleStyles['hide-focus'])} {...attributes} {...listeners}>
      <InternalIcon variant={disabled ? 'disabled' : undefined} name="drag-indicator" />
    </Handle>
  );
}
