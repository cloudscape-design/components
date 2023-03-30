// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import styles from '../../../collection-preferences/styles.selectors.js';
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

const getClassName = (suffix: string): string => styles[`content-display-${suffix}`];

export default class ContentDisplayPreferenceWrapper extends ComponentWrapper {
  static rootSelector = styles['content-display'];

  /**
   * Returns the title.
   */
  findTitle(): ElementWrapper {
    return this.findByClassName(getClassName('title'))!;
  }

  /**
   * Returns the label.
   */
  findLabel(): ElementWrapper {
    return this.findByClassName(getClassName('label'))!;
  }

  /**
   * Returns the options that the user can reorder.
   */
  findOptions(): Array<ElementWrapper> {
    return this.findAllByClassName(getClassName('option'));
  }
}
