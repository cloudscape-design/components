// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import CollectionPreferencesPageObject from '../../../__integ__/pages/collection-preferences-page';

export default class ContentDisplayPageObject extends CollectionPreferencesPageObject {
  async containsOptionsInOrder(options: string[]) {
    const texts = await this.getElementsText(this.findOptions().toSelector());
    return texts.join(`\n`).includes(options.join('\n'));
  }

  async expectAnnouncement(announcement: string) {
    const liveRegion = await this.browser.$(
      this.wrapper.findModal().findContentDisplayPreference().find('[aria-live="assertive"]').toSelector()
    );
    // Using getHTML because getText returns an empty string if the live region is outside the viewport.
    // See https://webdriver.io/docs/api/element/getText/
    return expect(liveRegion.getHTML(false)).resolves.toBe(announcement);
  }

  findDragHandle(index = 0) {
    return this.findOptions()
      .get(index + 1)
      .findDragHandle();
  }

  findOptions() {
    return this.wrapper.findModal().findContentDisplayPreference().findOptions();
  }

  focusDragHandle(index = 0) {
    return this.keys(new Array(5 + index * 2).fill('Tab'));
  }

  async openCollectionPreferencesModal() {
    await this.click(this.wrapper.findTriggerButton().toSelector());
    return expect(this.isExisting(this.wrapper.findModal().toSelector())).resolves.toBe(true);
  }
}
