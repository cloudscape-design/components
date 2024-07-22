// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../internal/components/abstract-switch/styles.selectors.js';

export default class AbstractSwitchWrapper extends ElementWrapper {
  static rootSelector = styles.wrapper;

  findLabel(): ElementWrapper {
    return this.findByClassName(styles['label-wrapper'])!;
  }

  findNativeInput(): ElementWrapper<HTMLInputElement> {
    return this.find<HTMLInputElement>(`.${styles.control} > input`)!;
  }

  findDescription(): ElementWrapper | null {
    return this.findByClassName(styles.description);
  }
}
