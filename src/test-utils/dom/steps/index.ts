// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../steps/styles.selectors.js';

export class StepWrapper extends ComponentWrapper {
  /**
   * Finds the header of a step
   */
  findHeader(): ElementWrapper | null {
    return this.findByClassName(styles.header);
  }

  /**
   * Finds the details of a step
   */
  findDetails(): ElementWrapper | null {
    return this.findByClassName(styles.details);
  }
}
export default class StepsWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  /**
   * Finds all step items
   */
  findItems(): Array<StepWrapper> {
    return this.findAllByClassName(styles.container).map(item => new StepWrapper(item.getElement()));
  }
}
