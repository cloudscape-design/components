// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../segmented-control/styles.selectors.js';

export default class SegmentedControlWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  findSegments(): Array<ElementWrapper> {
    return this.findAllByClassName(styles.segment);
  }

  findSelectedSegment(): ElementWrapper | null {
    return this.findByClassName(styles.selected);
  }
}
