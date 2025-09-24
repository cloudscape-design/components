// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import createWrapper, { InputWrapper } from '../../../../lib/components/test-utils/selectors';
import BasePageExtendedObject from '../../../__integ__/page-objects/base-page-ext';

export default class InputPage extends BasePageExtendedObject {
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
