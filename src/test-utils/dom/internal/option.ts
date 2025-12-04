// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, createWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../internal/components/option/styles.selectors.js';
import selectPartsStyles from '../../../select/parts/styles.selectors.js';

export default class OptionWrapper extends ComponentWrapper {
  static rootSelector: string = styles.option;

  findCustomContent(): ElementWrapper {
    return this.findByClassName(styles['custom-content'])!;
  }

  findLabel(): ElementWrapper {
    return this.findByClassName(styles.label)!;
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
