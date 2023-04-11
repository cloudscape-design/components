// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ButtonHTMLAttributes, ForwardedRef, forwardRef } from 'react';

import Handle from '../handle';
import InternalIcon from '../../icon/internal';
import styles from './styles.css.js';
import handleStyles from '../handle/styles.css.js';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import clsx from 'clsx';

export interface DragHandleProps {
  attributes: ButtonHTMLAttributes<HTMLDivElement>;
  hideFocus?: boolean;
  listeners?: SyntheticListenerMap;
}

function DragHandle({ attributes, hideFocus, listeners }: DragHandleProps, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <Handle
      ref={ref}
      className={clsx(styles.handle, hideFocus && handleStyles['hide-focus'])}
      {...attributes}
      {...listeners}
    >
      <InternalIcon name="drag-indicator" />
    </Handle>
  );
}

export default forwardRef(DragHandle);
