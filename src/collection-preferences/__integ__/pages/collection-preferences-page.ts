// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import { CollectionPreferencesWrapper } from '../../../../lib/components/test-utils/selectors';

export default class CollectionPreferencesPageObject extends BasePageObject {
  private wrapper: CollectionPreferencesWrapper | null = null;

  constructor(browser: ConstructorParameters<typeof BasePageObject>[0]) {
    super(browser);
  }

  async containsOptionsInOrder(options: string[]) {
    const texts = await this.getElementsText(
      this.wrapper!.findModal().findContentDisplayPreference().findOptions().toSelector()
    );
    return texts.join(`\n`).includes(options.join('\n'));
  }

  expectAnnouncement(announcement: string) {
    const liveRegion = this.wrapper!.findModal().findContentDisplayPreference().find('[aria-live="assertive"]');
    return expect(this.getText(liveRegion.toSelector())).resolves.toBe(announcement);
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
