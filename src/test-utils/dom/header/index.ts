// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../header/styles.selectors.js';

export default class HeaderWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  findHeadingText(): ElementWrapper {
    return this.findByClassName(styles['heading-text'])!;
  }

  findCounter(): ElementWrapper | null {
    return this.findByClassName(styles.counter);
  }

  findDescription(): ElementWrapper | null {
    return this.findByClassName(styles.description);
  }

  findInfo(): ElementWrapper | null {
    return this.findByClassName(styles.info);
  }

  findActions(): ElementWrapper | null {
    return this.findByClassName(styles.actions);
  }
}
