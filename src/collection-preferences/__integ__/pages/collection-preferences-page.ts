// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CollectionPreferencesWrapper } from '../../../../lib/components/test-utils/selectors';
import DndPageObject from '../../content-display/__integ__/pages/dnd-page-object';

export default class CollectionPreferencesPageObject extends DndPageObject {
  protected _wrapper?: CollectionPreferencesWrapper;

  set wrapper(wrapper: CollectionPreferencesWrapper) {
    this._wrapper = wrapper;
  }

  get wrapper() {
    if (!this._wrapper) {
      throw new Error('Must set collection preferences wrapper');
    }
    return this._wrapper;
  }

  async openCollectionPreferencesModal() {
    await this.click(this.wrapper.findTriggerButton().toSelector());
    return expect(this.isExisting(this.wrapper.findModal().toSelector())).resolves.toBe(true);
  }
}
