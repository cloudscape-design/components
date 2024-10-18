// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import styles from './styles.css.js';

/**
 * The controller singleton that manages a single live region container. It has a timer and
 * a queue to make sure announcements don't collide and messages are debounced correctly.
 * It also explicitly makes sure that a message is announced again even if it matches the
 * previous content of the live region.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
 */
export class LiveRegionController {
  /**
   * The default delay for announcements when no delay is explicitly provided.
   * During unit testing, you can import this and explicitly set it to 0 to make
   * the live region update the DOM without waiting for a timer.
   */
  public static defaultMinDelay = 2000;

  private _element: HTMLElement | undefined;
  private _timeoutId: number | undefined;
  private _lastAnnouncement = '';
  private _nextDelay = 0;
  private readonly _nextMessages = new Set<string>();

  constructor(public readonly politeness: 'polite' | 'assertive') {}

  /**
   * Lazily create a live region container element in the DOM.
   */
  initialize() {
    if (!this._element) {
      this._element = document.createElement('div');
      this._element.className = styles.announcer;
      this._element.setAttribute('aria-live', this.politeness);
      this._element.setAttribute('aria-atomic', 'true');
      this._element.setAttribute('data-awsui-live-announcer', 'true');

      document.body.appendChild(this._element);
    }
  }

  /**
   * Reset the state of the controller and clear any active announcements.
   */
  reset() {
    if (this._element) {
      this._element.textContent = '';
    }
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = undefined;
    }
  }

  announce(message: string, minDelay = LiveRegionController.defaultMinDelay) {
    this._nextMessages.add(message);

    if (this._nextDelay < minDelay) {
      this._nextDelay = minDelay;

      // A message was added with a longer delay, so we delay the whole announcement.
      // This is cleaner than potentially having valid announcements collide.
      if (this._timeoutId !== undefined) {
        clearTimeout(this._timeoutId);
        this._timeoutId = undefined;
      }
    }

    if (this._nextDelay === 0 && minDelay === 0) {
      // If the delay is 0, just skip the timeout shenanigans and update the
      // element synchronously. Great for tests.
      return this._updateElement();
    }

    if (this._timeoutId === undefined) {
      this._timeoutId = setTimeout(() => this._updateElement(), this._nextDelay);
    }
  }

  private _updateElement() {
    if (!this._element) {
      return;
    }

    let nextAnnouncement = [...this._nextMessages].join(' ');
    if (nextAnnouncement === this._lastAnnouncement) {
      // A (generally) safe way of forcing re-announcements is toggling the
      // terminal period. If we keep adding periods, it's going to be
      // eventually interpreted as an ellipsis.
      nextAnnouncement = nextAnnouncement.endsWith('..') ? nextAnnouncement.slice(0, -1) : nextAnnouncement + '.';
    }

    // The aria-atomic does not work properly in Voice Over, causing
    // certain parts of the content to be ignored. To fix that,
    // we assign the source text content as a single node.
    this._element.textContent = nextAnnouncement;
    this._lastAnnouncement = nextAnnouncement;

    // Reset the state for the next announcement.
    this._timeoutId = undefined;
    this._nextDelay = 0;
    this._nextMessages.clear();
  }
}

export const polite = new LiveRegionController('polite');
export const assertive = new LiveRegionController('assertive');
