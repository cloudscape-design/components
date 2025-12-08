// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, createWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../internal/components/option/styles.selectors.js';
import selectPartsStyles from '../../../select/parts/styles.selectors.js';

export default class OptionWrapper extends ComponentWrapper {
  static rootSelector: string = styles.option;

  /**
   * Finds the custom content wrapper of this option.
   * @returns {ElementWrapper} the ElementWrapper for the custom-content.
   */
  findCustomContent(): ElementWrapper {
    return this.findByClassName(styles['custom-content'])!;
  }

  /**
   * Finds the label wrapper of this option.
   * If no label element is found, falls back to custom content.
   * @returns {ElementWrapper} the ElementWrapper for the label or custom content as fallback.
   */
  findLabel(): ElementWrapper {
    const labelElementWrapper = this.findByClassName(styles.label);
    if (!labelElementWrapper) {
      return this.findCustomContent()!;
    } // Fallback, if label is null due to custom content.
    return labelElementWrapper;
  }

  findDescription(): ElementWrapper | null {
    return this.findByClassName(styles.description);
  }

  findLabelTag(): ElementWrapper | null {
    return this.findByClassName(styles['label-tag']);
  }

  findTags(): Array<ElementWrapper> | null {
    return this.findAllByClassName(styles.tag);
  }

  findDisabledReason(): ElementWrapper | null {
    return createWrapper().find(`.${selectPartsStyles['disabled-reason-tooltip']}`);
  }

  @usesDom
  isDisabled(): boolean {
    return this.element.classList.contains(styles.disabled);
  }
}
