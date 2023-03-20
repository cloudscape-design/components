// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import createWrapper from '../../../../lib/components/test-utils/selectors';

export default class CollectionPreferencesPageObject extends BasePageObject {
  constructor(
    browser: ConstructorParameters<typeof BasePageObject>[0],
    protected wrapper = createWrapper().findCollectionPreferences()
  ) {
    super(browser);
  }

  async containsOptionsInOrder(options: string[]) {
    const texts = await this.getElementsText(
      this.wrapper.findModal().findContentDisplayPreference().findOptions().toSelector()
    );
    return texts.join(`\n`).includes(options.join('\n'));
  }

  focusDragHandle(index = 0) {
    return this.keys(new Array(5 + index * 2).fill('Tab'));
  }

  async openCollectionPreferencesModal(wrapper = this.wrapper) {
    await this.click(wrapper.findTriggerButton().toSelector());
    return expect(this.isExisting(wrapper.findModal().toSelector())).resolves.toBe(true);
  }
}
