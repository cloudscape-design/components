// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { containsOrEqual } from './utils/dom';

interface FocusTrackerOptions {
  onFocusEnter: () => void;
  onFocusLeave: () => void;
}

export default class FocusTracker {
  private readonly onFocusLeave: () => void;
  private readonly onFocusEnter: () => void;
  private readonly viewportId: string;

  private currentlyFocused = false;

  constructor(private node: HTMLElement, { onFocusEnter, onFocusLeave }: FocusTrackerOptions, viewportId = '') {
    this.onFocusEnter = onFocusEnter;
    this.onFocusLeave = onFocusLeave;
    this.viewportId = viewportId;
  }

  initialize() {
    this.currentlyFocused = document.activeElement ? containsOrEqual(this.node, document.activeElement) : false;
    document.addEventListener('focusin', this.focusInListener);
    document.addEventListener('focusout', this.focusOutListener);
  }

  destroy() {
    document.removeEventListener('focusin', this.focusInListener);
    document.removeEventListener('focusout', this.focusOutListener);
  }

  private focusInListener = (event: FocusEvent) => {
    const focusIsInside = containsOrEqual(this.node, event.target as Node);
    if (!this.currentlyFocused && focusIsInside) {
      this.triggerFocus();
    }
  };

  private focusOutListener = (event: FocusEvent) => {
    const nextFocused = event.relatedTarget as Node;
    let isNextFocusedInParent = !containsOrEqual(this.node, nextFocused);

    if (this.viewportId) {
      const viewport = document.getElementById(this.viewportId);
      isNextFocusedInParent = isNextFocusedInParent && !containsOrEqual(viewport, nextFocused);
    }
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
