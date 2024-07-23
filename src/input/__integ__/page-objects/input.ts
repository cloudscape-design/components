// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';

import createWrapper, { InputWrapper } from '../../../../lib/components/test-utils/selectors';

export default class InputPage extends BasePageObject {
  protected wrapper: InputWrapper = createWrapper('#test').findInput();

  async visit(url: string) {
    await this.browser.url(url);
    await this.waitForVisible(this.wrapper.findNativeInput().toSelector());
  }

  isFormSubmitted() {
    return this.isExisting('#submit-success');
  }

  async focusInput() {
    await this.click(this.wrapper.findNativeInput().toSelector());
  }

  async disableFormSubmitting() {
    await this.click('#disable-form-submitting');
  }
}
