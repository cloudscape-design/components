// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';

import createWrapper from '../../../../lib/components/test-utils/selectors';

export default class TextareaPage extends BasePageObject {
  public wrapper = createWrapper('#test').findTextarea();

  async visit(url: string) {
    await this.browser.url(url);
    await this.waitForVisible(this.wrapper.toSelector());
  }

  isFormSubmitted() {
    return this.isExisting('#submit-success');
  }

  async focusTextarea() {
    await this.click(this.wrapper.toSelector());
  }
}
