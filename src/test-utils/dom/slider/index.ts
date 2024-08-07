// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import BaseInputWrapper from '../input/base-input.js';

import styles from '../../../slider/styles.selectors.js';

export default class SliderWrapper extends BaseInputWrapper {
  static rootSelector = styles.root;

  findNativeInput(): ElementWrapper<HTMLInputElement> {
    return this.findByClassName(styles.thumb)!;
  }
}
