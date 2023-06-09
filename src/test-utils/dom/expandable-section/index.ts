// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../expandable-section/styles.selectors.js';
import containerStyles from '../../../container/styles.selectors.js';

export default class ExpandableSectionWrapper extends ComponentWrapper {
  static rootSelector = styles.root;

  findHeader(): ElementWrapper {
    return this.findByClassName(styles.header)!;
  }

  findContent(): ElementWrapper {
    return this.findByClassName(styles.content)!;
  }

  /*
   * Returns the area that can be clicked in order to expand or collapse the section.
   */
  findExpandButton(): ElementWrapper {
    return this.findByClassName(styles['expand-button'])!;
  }

  findExpandedContent(): ElementWrapper | null {
    return this.find(
      `:scope > .${styles['content-expanded']}, :scope > .${containerStyles.content} > .${styles['content-expanded']}`
    );
  }

  findExpandIcon(): ElementWrapper {
    return this.findByClassName(styles['icon-container'])!;
  }
}
