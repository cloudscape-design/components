// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import RadioButtonWrapper from '../radio-group/radio-button';

import styles from '../../../tiles/styles.selectors.js';

export default class TileWrapper extends ElementWrapper {
  static rootSelector: string = styles['tile-container'];

  private findRadioButton(): RadioButtonWrapper {
    return new RadioButtonWrapper(this.getElement());
  }

  findLabel(): ElementWrapper {
    return this.findRadioButton().findLabel();
  }

  findDescription(): ElementWrapper | null {
    return this.findRadioButton().findDescription();
  }

  findImage(): ElementWrapper {
    return this.findByClassName(styles.image)!;
  }

  findNativeInput(): ElementWrapper {
    return this.findRadioButton().findNativeInput();
  }
}
