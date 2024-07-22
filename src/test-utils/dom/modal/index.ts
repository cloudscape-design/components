// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../modal/styles.selectors.js';

export default class ModalWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  findHeader(): ElementWrapper {
    return this.findByClassName(styles.header)!;
  }

  findContent(): ElementWrapper {
    return this.findByClassName(styles.content)!;
  }

  findFooter(): ElementWrapper | null {
    return this.findByClassName(styles.footer);
  }

  findDismissButton(): ElementWrapper {
    return this.findByClassName(styles['dismiss-control'])!;
  }

  @usesDom
  isVisible(): boolean {
    return !this.element.classList.contains(styles.hidden);
  }
}
