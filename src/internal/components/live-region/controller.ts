// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import styles from './styles.css.js';

class LiveRegionController {
  private _element: HTMLElement | undefined;
  private _timeoutId: number | undefined;
  private _delay = 0;
  private _lastAnnouncement = '';
  private readonly _nextMessages = new Set<string>();

  constructor(public readonly politeness: 'polite' | 'assertive') {}

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

  announce(message: string, minDelay = 50) {
    this._nextMessages.add(message);

    // A message was added with a longer delay, so we delay the whole announcement.
    // This is cleaner than potentially having valid announcements collide.
    if (this._timeoutId !== undefined && minDelay !== undefined && this._delay < minDelay) {
      this._delay = minDelay;
      clearTimeout(this._timeoutId);
      this._timeoutId = undefined;
    }

    if (this._delay === 0 && minDelay === 0) {
      // If the delay is 0, just skip the timeout shenanigans and update the
      // element synchronously. Great for tests.
      this._updateElement();
    } else if (this._timeoutId === undefined) {
      this._timeoutId = setTimeout(() => this._updateElement(), this._delay);
    }
  }

  reset() {
    if (this._element) {
      this._element.textContent = '';
    }
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = undefined;
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
      nextAnnouncement = nextAnnouncement.endsWith('.') ? nextAnnouncement.slice(0, -1) : nextAnnouncement + '.';
    }

    // The aria-atomic does not work properly in Voice Over, causing
    // certain parts of the content to be ignored. To fix that,
    // we assign the source text content as a single node.
    this._element.textContent = nextAnnouncement;
    this._lastAnnouncement = nextAnnouncement;

    // Reset the state for the next announcement.
    this._timeoutId = undefined;
    this._delay = 0;
    this._nextMessages.clear();
  }
}

export const polite = new LiveRegionController('polite');
export const assertive = new LiveRegionController('assertive');
