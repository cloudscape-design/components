// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../carousel/styles.selectors.js';

export class CarouselItemWrapper extends ComponentWrapper {
  /**
   * Finds the content of a carousel
   */
  findContent(): ElementWrapper | null {
    return this.findByClassName(styles['content-wrapper']);
  }
}

export default class CarouselWrapper extends ComponentWrapper<HTMLDivElement> {
  static rootSelector: string = styles.root;

  findItems(): Array<CarouselItemWrapper> {
    return this.findAllByClassName(styles['carousel-item']).map(item => new CarouselItemWrapper(item.getElement()));
  }
}
