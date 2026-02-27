// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

/**
 * The controller that manages a single live region container. It has a timer
 * to make sure announcements are throttled correctly. It can also make sure
 * that a message is announced again even if it matches the previous content
 * of the live region.
 *
 * Multiple LiveRegion instances are automatically coordinated to prevent
 * screen readers from dropping announcements when they occur simultaneously.
 * Announcements are staggered with a minimum gap to ensure all are heard.
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

  /**
   * Minimum time gap between announcements from different
   * LiveRegion instances. This prevents screen readers from dropping
   * announcements when multiple live regions update simultaneously.
   *
   * Screen readers throttle announcements to avoid overwhelming users.
   * A 500ms gap ensures each announcement is detected and spoken.
   */
  private static readonly MIN_ANNOUNCEMENT_GAP_MS = 500;

  /**
   * Timestamp of the next available announcement slot (in milliseconds).
   * Used to coordinate announcements across all LiveRegion instances.
   */
  private static _nextAvailableSlot = 0;

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
    this._element.className = `${styles.announcer} ${testUtilStyles.announcer}`;
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

  announce({
    message,
    delay,
    forceReannounce = false,
  }: {
    message?: string;
    delay?: number;
    forceReannounce?: boolean;
  }) {
    if (!message) {
      return;
    }

    this._nextAnnouncement = message.trim();

    // Use the provided delay or fall back to the instance delay
    const effectiveDelay = delay !== undefined ? delay : this.delay;

    if (effectiveDelay === 0 || forceReannounce) {
      // If the delay is 0, just skip the timeout shenanigans and update the
      // element synchronously. Great for tests.
      return this._updateElement(forceReannounce);
    }

    // Clear any existing timeout to ensure the latest announcement is used.
    if (this._timeoutId !== undefined) {
      clearTimeout(this._timeoutId);
    }

    // Calculate when this announcement wants to happen
    const now = Date.now();
    const requestedTime = now + effectiveDelay * 1000;

    // Check if we need to stagger to avoid collision with other announcements.
    // When multiple LiveRegion instances announce simultaneously, screen readers
    // may drop some announcements. We automatically stagger them with a minimum
    // gap to ensure all are heard.
    let actualAnnouncementTime = requestedTime;

    if (requestedTime < LiveRegionController._nextAvailableSlot) {
      // Another announcement is scheduled too close - stagger this one
      actualAnnouncementTime = LiveRegionController._nextAvailableSlot;
    }

    // Reserve this time slot for this announcement
    LiveRegionController._nextAvailableSlot = actualAnnouncementTime + LiveRegionController.MIN_ANNOUNCEMENT_GAP_MS;

    // Calculate the actual delay needed (may be longer than requested due to staggering)
    const actualDelay = actualAnnouncementTime - now;

    // Create timeout with potentially adjusted delay
    this._timeoutId = setTimeout(() => this._updateElement(false), actualDelay);
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
