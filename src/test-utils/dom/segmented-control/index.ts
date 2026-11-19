// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, createWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../segmented-control/styles.selectors.js';

export class SegmentWrapper extends ComponentWrapper {
  findDisabledReason(): ElementWrapper | null {
    return createWrapper().find(`.${styles['disabled-reason-tooltip']}`);
  }
}

export default class SegmentedControlWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  findSegments(): Array<ElementWrapper> {
    return this.findAllByClassName(styles.segment);
  }

  findSelectedSegment(): ElementWrapper | null {
    return this.findByClassName(styles.selected);
  }

  /**
   * Finds the segment with the given ID.
   *
   * @param id ID of the element to return.
   */
  findSegmentById(id: string): SegmentWrapper | null {
    return this.findComponent(`.${styles.segment}[data-testid="${id}"]`, SegmentWrapper);
  }
}
