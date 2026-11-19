// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';

import createWrapper from '../../../../../lib/components/test-utils/selectors';

export class PageObject extends BasePageObject {
  resizeWindow(width: number, height: number) {
    return this.browser.setWindowSize(width, height);
  }

  async setMeasureType(type: 'width' | 'height') {
    const segmentIndex = type === 'width' ? 1 : 2;
    await this.click(createWrapper().findSegmentedControl().findSegments().get(segmentIndex).toSelector());
  }
}
