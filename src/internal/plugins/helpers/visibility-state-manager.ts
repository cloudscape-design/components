// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * This class is used to manage the visibility state of the runtime drawers.
 */
export default class VisibilityStateManager {
  isVisible = false;
  visibilityCallback: ((isPaused: boolean) => void) | null = null;

  private onVisibleStateChange = () => {
    if (this.visibilityCallback) {
      this.visibilityCallback(this.isVisible);
    }
  };

  registerVisibilityCallback = (callback: (isVisible: boolean) => void) => {
    this.visibilityCallback = callback;

    return () => {
      this.visibilityCallback = null;
    };
  };

  show = () => {
    this.isVisible = true;
    this.onVisibleStateChange();
  };

  hide = () => {
    this.isVisible = false;
    this.onVisibleStateChange();
  };
}
