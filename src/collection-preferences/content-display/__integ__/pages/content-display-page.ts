// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CollectionPreferencesWrapper } from '../../../../../lib/components/test-utils/selectors';
import { collectionPreferencesPageMixin } from '../../../__integ__/pages/collection-preferences-page';
import DndPageObject from './dnd-page-object';

export default class ContentDisplayPageObject extends collectionPreferencesPageMixin(DndPageObject) {
  async containsOptionsInOrder(options: string[]) {
    const texts = await this.getElementsText(this.findOptions().toSelector());
    return texts.join(`\n`).includes(options.join('\n'));
  }

  async expectAnnouncement(announcement: string) {
    const liveRegion = await this.browser.$(
      this.wrapper!.findModal().findContentDisplayPreference().find('[aria-live="assertive"]').toSelector()
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
    return this.wrapper!.findModal().findContentDisplayPreference().findOptions();
  }

  focusDragHandle(index = 0) {
    return this.keys(new Array(5 + index * 2).fill('Tab'));
  }

  async openCollectionPreferencesModal(wrapper: CollectionPreferencesWrapper) {
    this.wrapper = wrapper;
    await this.click(wrapper.findTriggerButton().toSelector());
    return expect(this.isExisting(wrapper.findModal().toSelector())).resolves.toBe(true);
  }
}
