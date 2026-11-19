// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../internal/components/structured-item/test-classes/styles.selectors.js';

export default class StructuredItemWrapper extends ComponentWrapper {
  static rootSelector = styles.wrapper;

  findContent(): ElementWrapper {
    return this.findByClassName(styles.content)!;
  }

  findIcon(): ElementWrapper | null {
    return this.findByClassName(styles.icon);
  }

  findActions(): ElementWrapper | null {
    return this.findByClassName(styles.actions);
  }

  findSecondaryContent(): ElementWrapper | null {
    return this.findByClassName(styles.secondary);
  }
}
