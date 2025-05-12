// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import useInternalDragHandleInteractionState, {
  UseDragHandleInteractionStateProps,
} from '../components/drag-handle/hooks/use-drag-handle-interaction-state';
import InternalDragHandle, { DragHandleProps } from '../components/drag-handle/index.js';

export type InternalDragHandleProps = DragHandleProps;
export type UseInternalDragHandleInteractionStateProps = UseDragHandleInteractionStateProps;
export { InternalDragHandle, useInternalDragHandleInteractionState };
