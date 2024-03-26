// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../slider/styles.selectors.js';

export default class SliderWrapper extends ComponentWrapper {
  static rootSelector = styles.root;

  getNativeInput(): ElementWrapper<HTMLInputElement> | null {
    return this.findByClassName(styles.thumb);
  }
}
