// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BaseComponentProps } from '../internal/base-component';

export interface DragHandleProps extends BaseComponentProps {
  variant?: DragHandleProps.Variant;
  size?: DragHandleProps.Size;
  ariaLabel: string;
  ariaDescribedby?: string;
  ariaValue?: DragHandleProps.AriaValue;
  disabled?: boolean;
  // TODO: keyboard handlers exposure problem.
  onPointerDown?: React.PointerEventHandler;
  onKeyDown?: React.KeyboardEventHandler;
}

export namespace DragHandleProps {
  export type Variant = 'drag-indicator' | 'resize-area' | 'resize-horizontal' | 'resize-vertical';

  export type Size = 'small' | 'normal';

  export interface AriaValue {
    valueMin: number;
    valueMax: number;
    valueNow: number;
  }

  export interface Ref {
    focus(options?: FocusOptions): void;
  }
}
