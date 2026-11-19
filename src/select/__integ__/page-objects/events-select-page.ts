// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import SelectPage from './select-page';

interface ExtendedWindow extends Window {
  __eventsLog?: string[];
  __clearEvents?: () => void;
}
declare const window: ExtendedWindow;

export default class EventsSelectPage extends SelectPage {
  async assertEventsFired(log: string[]) {
    const events = await this.browser.execute(() => window.__eventsLog || []);
    const expected = JSON.stringify(events);
    const actual = JSON.stringify(log);
    expect(expected).toEqual(actual);
  }
  async clearEventList() {
    await this.browser.execute(() => window.__clearEvents && window.__clearEvents());
  }
  async focusOutsideInput() {
    await this.click('#focusable');
  }
  async expandToViewport() {
    await this.click('#expand-to-viewport');
  }
  async enableFiltering() {
    await this.click('#filtering');
  }
}
