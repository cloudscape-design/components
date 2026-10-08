// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import CollectionPreferencesPageObject from '../../../__integ__/pages/collection-preferences-page';

export default class ContentDisplayPageObject extends CollectionPreferencesPageObject {
  // Reads every option label in a single script evaluation. Fetching them through the
  // WebDriver protocol costs one round-trip per element, which is 50 for the long list and
  // dominated the runtime of these tests on CI. Returns the same strings as getText(),
  // both before and after the list is scrolled.
  async getOptionTexts(): Promise<string[]> {
    return (await this.browser.execute(
      selector =>
        Array.prototype.map.call(document.querySelectorAll(selector), element =>
          (element as HTMLElement).innerText.trim()
        ),
      this.findOptions().toSelector()
    )) as string[];
  }

  async containsOptionsInOrder(options: string[]) {
    const texts = await this.getOptionTexts();
    const result = texts.join(`\n`).includes(options.join('\n'));
    if (!result) {
      throw new Error(`Options are not in the expected order:
        Expected: ${options.join(', ')}
        Found: ${texts.join(', ')}`);
    }
    return true;
  }

  async getOptionLabels(
    options: { get(index: number): { findLabel(): { toSelector(): string } } },
    count: number
  ): Promise<string[]> {
    const labels: string[] = [];
    for (let i = 0; i < count; i++) {
      labels.push(
        await this.getText(
          options
            .get(i + 1)
            .findLabel()
            .toSelector()
        )
      );
    }
    return labels;
  }

  async expectAnnouncement(announcement: string) {
    const liveRegion = await this.browser.$('[aria-live="assertive"]');
    // Using getHTML because getText returns an empty string if the live region is outside the viewport.
    // See https://webdriver.io/docs/api/element/getText/
    return this.waitForAssertion(() => expect(liveRegion.getHTML()).resolves.toContain(announcement));
  }

  findDragHandle(index = 0) {
    return this.findOptions()
      .get(index + 1)
      .findDragHandle();
  }

  findOptions() {
    return this.wrapper.findModal().findContentDisplayPreference().findOptions();
  }

  async focusDragHandle(index = 0) {
    const isSearchable = await this.isExisting(
      this.wrapper.findModal().findContentDisplayPreference().findTextFilter().toSelector()
    );
    const offset = isSearchable ? 6 : 5;

    return this.keys(new Array(offset + index * 2).fill('Tab'));
  }

  async openCollectionPreferencesModal() {
    await this.click(this.wrapper.findTriggerButton().toSelector());
    return expect(this.isExisting(this.wrapper.findModal().toSelector())).resolves.toBe(true);
  }
}
