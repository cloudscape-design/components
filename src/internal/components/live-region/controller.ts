// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import styles from './styles.css.js';

class LiveRegionController {
  private _element: HTMLElement | undefined;
  private _timeoutId: number | undefined;
  private _delay: number;
  private readonly _nextMessage = new Set<string>();

  constructor(public readonly politeness: 'polite' | 'assertive', public readonly defaultDelay: number = 50) {
    this._delay = defaultDelay;
  }

  initialize() {
    if (!this._element) {
      this._element = document.createElement('div');
      this._element.className = styles.announcer;
      this._element.ariaLive = this.politeness;
      this._element.ariaAtomic = 'true';
      document.body.appendChild(this._element);
    }
  }

  announce(message: string, minDelay?: number) {
    this._nextMessage.add(message);

    // A message was added with a longer delay, so we delay the whole announcement.
    // This is cleaner than potentially having valid announcements collide.
    if (this._timeoutId !== undefined && minDelay !== undefined && this._delay < minDelay) {
      this._delay = minDelay;
      clearTimeout(this._timeoutId);
      this._timeoutId = undefined;
    }

    if (this._timeoutId === undefined) {
      this._timeoutId = setTimeout(() => this._updateElement(), this._delay);
    }
  }

  destroy() {
    this._element?.remove();
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
    }
  }

  private _updateElement() {
    if (!this._element) {
      return;
    }

    // TODO: check if next announcement was the same as the last one?

    // The aria-atomic does not work properly in Voice Over, causing
    // certain parts of the content to be ignored. To fix that,
    // we assign the source text content as a single node.
    this._element.innerText = [...this._nextMessage].join(' ');

    this._timeoutId = undefined;
    this._delay = this.defaultDelay;
    this._nextMessage.clear();
  }
}

export const polite = new LiveRegionController('polite');
export const assertive = new LiveRegionController('assertive');
