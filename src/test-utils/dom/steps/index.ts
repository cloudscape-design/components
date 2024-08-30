// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import testUtilStyles from '../../../steps/test-classes/styles.selectors.js';

export default class StepsWrapper extends ComponentWrapper {
  static rootSelector: string = testUtilStyles.steps;

  /**
   * Finds all step items
   */
  findItems(): Array<ElementWrapper> {
    return this.findAllByClassName(testUtilStyles['step-container']);
  }
}
