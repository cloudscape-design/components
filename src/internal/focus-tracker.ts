// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { nodeBelongs } from './utils/node-belongs';

interface FocusTrackerOptions {
  onFocusEnter: () => void;
  onFocusLeave: () => void;
}

export default class FocusTracker {
  private readonly onFocusLeave: () => void;
  private readonly onFocusEnter: () => void;
  private readonly controller: AbortController;

  private currentlyFocused = false;

  constructor(
    private node: HTMLElement,
    { onFocusEnter, onFocusLeave }: FocusTrackerOptions
  ) {
    this.onFocusEnter = onFocusEnter;
    this.onFocusLeave = onFocusLeave;
    this.controller = new AbortController();
  }

  initialize() {
    this.currentlyFocused = nodeBelongs(this.node, document.activeElement);
    document.addEventListener('focusin', this.focusInListener, { signal: this.controller.signal });
    document.addEventListener('focusout', this.focusOutListener, { signal: this.controller.signal });
  }

  destroy() {
    this.controller.abort();
  }

  private focusInListener = (event: FocusEvent) => {
    const focusIsInside = nodeBelongs(this.node, event.target);
    if (!this.currentlyFocused && focusIsInside) {
      this.triggerFocus();
    }
  };

  private focusOutListener = (event: FocusEvent) => {
    const nextFocused = event.relatedTarget;
    const isNextFocusedInParent = !nodeBelongs(this.node, nextFocused);
    if (this.currentlyFocused && (nextFocused === null || isNextFocusedInParent)) {
      this.triggerBlur();
    }
  };

  private triggerBlur() {
    this.currentlyFocused = false;
    this.onFocusLeave();
  }

  private triggerFocus() {
    this.currentlyFocused = true;
    this.onFocusEnter();
  }
}
