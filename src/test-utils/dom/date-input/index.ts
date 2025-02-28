// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import BaseInputWrapper from '../input/base-input.js';

import selectors from '../../../date-input/styles.selectors.js';

export default class DateInputWrapper extends BaseInputWrapper {
  static rootSelector: string = selectors.root;
}
