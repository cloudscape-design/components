// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { usesDom } from '@cloudscape-design/test-utils-core/dom';

import BaseInputWrapper from '../input/base-input';

import selectors from '../../../date-input/styles.selectors.js';

export default class DateInputWrapper extends BaseInputWrapper {
  static rootSelector: string = selectors.root;

  /**
   * Sets the value of the component and calls the `onChange` handler.
   * The value needs to use the "YYYY/MM/DD" format,
   * but the subsequent `onChange` handler will contain the value in the "YYYY-MM-DD" format.
   *
   * @param value The value the input is set to, using the "YYYY/MM/DD" format.
   */
  @usesDom setInputValue(value: string): void {
    return super.setInputValue(value);
  }
}
