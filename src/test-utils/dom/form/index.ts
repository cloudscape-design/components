// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../form/styles.selectors.js';

export default class FormWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  findHeader(): ElementWrapper | null {
    return this.findByClassName(styles.header);
  }

  findContent(): ElementWrapper | null {
    return this.findByClassName(styles.content);
  }

  findError(): ElementWrapper | null {
    return this.findByClassName(styles.error);
  }

  findActions(): ElementWrapper | null {
    return this.findByClassName(styles.actions);
  }

  findSecondaryActions(): ElementWrapper | null {
    return this.findByClassName(styles['secondary-actions']);
  }
}
