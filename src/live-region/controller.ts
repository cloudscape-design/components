// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import styles from './styles.css.js';

/**
 * The controller that manages a single live region container. It has a timer
 * to make sure announcements are throttled correctly. It can also make sure
 * that a message is announced again even if it matches the previous content
 * of the live region.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
 */
export class LiveRegionController {
  /**
   * The default delay for announcements when no delay is explicitly provided.
   * During internal unit testing, you can import this and explicitly set it to
   * 0 to make the live region update the DOM without waiting for a timer.
   */
  public static defaultDelay = 2;

  private _element: HTMLElement;
  private _timeoutId: number | undefined;
  private _lastAnnouncement: string | undefined;
  private _addedTerminalPeriod = false;
  private _nextAnnouncement = '';

  constructor(
    public readonly politeness: 'polite' | 'assertive',
    public readonly delay = LiveRegionController.defaultDelay
  ) {
    this._element = document.createElement('div');
    this._element.className = styles.announcer;
    this._element.setAttribute('aria-live', this.politeness);
    this._element.setAttribute('aria-atomic', 'true');
    document.body.appendChild(this._element);
  }

  /**
   * Reset the state of the controller and clear any active announcements.
   */
  destroy() {
    this._element?.remove();
    if (this._timeoutId !== undefined) {
      clearTimeout(this._timeoutId);
      this._timeoutId = undefined;
    }
  }

  announce({ message, forceReannounce = false }: { message?: string; delay?: number; forceReannounce?: boolean }) {
    if (!message) {
      return;
    }

    this._nextAnnouncement = message.trim();

    if (this.delay === 0 || forceReannounce) {
      // If the delay is 0, just skip the timeout shenanigans and update the
      // element synchronously. Great for tests.
      return this._updateElement(forceReannounce);
    }

    if (this._timeoutId === undefined) {
      this._timeoutId = setTimeout(() => this._updateElement(false), this.delay * 1000);
    }
  }

  private _updateElement(forceReannounce: boolean) {
    if (this._nextAnnouncement !== this._lastAnnouncement) {
      // The aria-atomic does not work properly in Voice Over, causing
      // certain parts of the content to be ignored. To fix that,
      // we assign the source text content as a single node.
      this._element.textContent = this._nextAnnouncement;
      this._addedTerminalPeriod = false;
    } else if (forceReannounce) {
      // A (generally) safe way of forcing re-announcements is toggling the
      // terminal period. If we only keep adding periods, it's going to be
      // eventually interpreted as an ellipsis.
      this._element.textContent = this._nextAnnouncement + (this._addedTerminalPeriod ? '' : '.');
      this._addedTerminalPeriod = !this._addedTerminalPeriod;
    }

    // Track the announced text for deduplication.
    this._lastAnnouncement = this._nextAnnouncement;

    // Reset the state for the next announcement.
    this._timeoutId = undefined;
  }
}
