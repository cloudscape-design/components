// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../help-panel/styles.selectors.js';

export default class HelpPanelWrapper extends ComponentWrapper {
  static rootSelector: string = styles['help-panel'];

  findHeader(): ElementWrapper | null {
    return this.findByClassName(styles.header);
  }

  findContent(): ElementWrapper | null {
    return this.findByClassName(styles.content);
  }

  findFooter(): ElementWrapper | null {
    return this.findByClassName(styles.footer);
  }
}
