// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ButtonHTMLAttributes, ForwardedRef, forwardRef } from 'react';

import Handle from '../handle';
import InternalIcon from '../../icon/internal';
import styles from './styles.css.js';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

export interface DragHandleProps {
  attributes: ButtonHTMLAttributes<HTMLDivElement>;
  listeners?: SyntheticListenerMap;
}

function DragHandle({ attributes, listeners }: DragHandleProps, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <div role="application">
      <Handle ref={ref} className={styles.handle} {...attributes} {...listeners}>
        <InternalIcon name="drag-indicator" />
      </Handle>
    </div>
  );
}

export default forwardRef(DragHandle);
