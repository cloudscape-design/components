// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import DropdownWrapper from '../../../../../lib/components/test-utils/selectors/internal/dropdown';

export class DropdownPageObject extends BasePageObject {
  private dropdownWrapper: DropdownWrapper;
  constructor(
    private dropdownId: string,
    browser: ConstructorParameters<typeof BasePageObject>[0]
  ) {
    super(browser);
    this.dropdownWrapper = new DropdownWrapper(`#${this.dropdownId}`);
  }

  public async getDropdownVerticalDirection() {
    const { top: dropdownTop } = await this.getBoundingBox(this.getOpenDropdown());
    const { top: triggerTop } = await this.getBoundingBox(this.getTrigger());
    return dropdownTop > triggerTop ? 'down' : 'up';
  }

  public getDropdown(): string {
    return this.dropdownWrapper.toSelector();
  }
  public getTrigger(): string {
    return this.dropdownWrapper.find('.trigger').toSelector();
  }
  public getOpenDropdown(): string {
    return this.dropdownWrapper.findOpenDropdown().toSelector();
  }
}
