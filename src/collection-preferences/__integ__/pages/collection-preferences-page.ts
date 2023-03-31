// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import { CollectionPreferencesWrapper } from '../../../../lib/components/test-utils/selectors';

export const collectionPreferencesPageMixin = (Base: BasePageObject & any) =>
  class extends Base {
    wrapper: CollectionPreferencesWrapper | null = null;
    constructor(browser: ConstructorParameters<typeof BasePageObject>[0]) {
      super(browser);
    }
    async openCollectionPreferencesModal(wrapper: CollectionPreferencesWrapper) {
      this.wrapper = wrapper;
      await this.click(wrapper.findTriggerButton().toSelector());
      return expect(this.isExisting(wrapper.findModal().toSelector())).resolves.toBe(true);
    }
  };

export default class CollectionPreferencesPageObject extends collectionPreferencesPageMixin(BasePageObject) {}
