// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../panel-layout/test-classes/styles.selectors.js';

export default class PanelLayoutWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  /**
   * Returns the wrapper for the panel element.
   */
  findPanelContent(): ElementWrapper | null {
    return this.findByClassName(styles.panel);
  }

  /**
   * Returns the wrapper for the main content element.
   */
  findMainContent(): ElementWrapper | null {
    return this.findByClassName(styles.content);
  }

  /**
   * Returns the wrapper for the resize handle element.
   * Returns null if the panel layout is not resizable.
   */
  findResizeHandle(): ElementWrapper | null {
    return this.findByClassName(styles.slider);
  }
}
