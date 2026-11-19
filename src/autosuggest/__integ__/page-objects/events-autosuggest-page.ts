// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import AutosuggestPage from './autosuggest-page';
interface ExtendedWindow extends Window {
  __eventsLog?: string[];
  __clearEvents?: () => void;
}
declare const window: ExtendedWindow;

export default class EventsAutosuggestPage extends AutosuggestPage {
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
  getAutosuggestValue() {
    return this.getValue(this.wrapper.findNativeInput().toSelector());
  }
}
