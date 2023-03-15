// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ForwardedRef, forwardRef } from 'react';

import Handle from '../handle';
import DragHandleIcon from './icon';
import styles from './styles.css.js';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { DraggableAttributes } from '@dnd-kit/core';

export interface DragHandleProps {
  attributes: DraggableAttributes;
  listeners?: SyntheticListenerMap;
}

function DragHandle({ attributes, listeners }: DragHandleProps, ref: ForwardedRef<HTMLButtonElement>) {
  return (
    <Handle ref={ref} className={styles.handle} {...attributes} {...listeners}>
      <DragHandleIcon />
    </Handle>
  );
}

export default forwardRef(DragHandle);
