// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import useInternalDragHandleInteractionState, {
  UseDragHandleInteractionStateProps as UseInternalDragHandleInteractionStateProps,
} from '../components/drag-handle/hooks/use-drag-handle-interaction-state.js';
import InternalDragHandle, { DragHandleProps as InternalDragHandleProps } from '../components/drag-handle/index.js';

export type { InternalDragHandleProps, UseInternalDragHandleInteractionStateProps };
export { InternalDragHandle, useInternalDragHandleInteractionState };
