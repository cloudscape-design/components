// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import React from 'react';
import { NonCancelableEventHandler } from '../internal/events';

export interface ModalProps extends BaseComponentProps {
  /**
   * Sets the width of the modal. `max` uses variable width up to the
   * largest size allowed by the design guidelines. Other sizes
   * (`small`/`medium`/`large`) have fixed widths.
   */
  size?: ModalProps.Size;
  /**
   * Determines whether the modal is displayed on the screen. Modals are hidden by default.
   * Set this property to `true` to show them.
   */
  visible: boolean;
  /**
   * Adds an `aria-label` to the close button, for accessibility.
   * @i18n
   */
  closeAriaLabel?: string;
  /**
   * Specifies a title for the modal. Although this can be empty, we suggest that you always provide a title.
   */
  header?: React.ReactNode;
  /**
   * Body of the modal.
   */
  children?: React.ReactNode;
  /**
   * Specifies a footer for the modal. If empty, the footer isn't displayed.
   */
  footer?: React.ReactNode;
  /**
   * Determines whether the modal content has padding. If `true`, removes the default padding from the content area.
   */
  disableContentPaddings?: boolean;
  /**
   * Called when a user closes the modal by using the close icon button,
   * clicking outside of the modal, or pressing ESC.
   * The event detail contains the `reason`, which can be any of the following:
   * `['closeButton', 'overlay', 'keyboard']`.
   */
  onDismiss?: NonCancelableEventHandler<ModalProps.DismissDetail>;
  /**
   * Specifies the HTML element where the modal is rendered.
   * If a modal root isn't provided, the modal will render to an element under `document.body`.
   */
  modalRoot?: HTMLElement;
}

export namespace ModalProps {
  export type Size = 'small' | 'medium' | 'large' | 'max';

  export interface DismissDetail {
    reason: string;
  }
}
