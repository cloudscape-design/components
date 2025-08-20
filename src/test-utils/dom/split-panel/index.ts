// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, createWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import ButtonWrapper from '../button';

import headerTestUtilStyles from '../../../split-panel/header/test-classes/styles.selectors.js';
import testUtilStyles from '../../../split-panel/test-classes/styles.selectors.js';

export default class SplitPanelWrapper extends ComponentWrapper {
  static rootSelector: string = testUtilStyles.root;

  findHeader(): ElementWrapper {
    return this.find(`.${headerTestUtilStyles['header-text']}`)!;
  }

  findPreferencesButton(): ButtonWrapper | null {
    return this.findComponent(`.${headerTestUtilStyles['preferences-button']}`, ButtonWrapper);
  }

  findCloseButton(): ButtonWrapper | null {
    return this.findComponent(`.${headerTestUtilStyles['close-button']}`, ButtonWrapper);
  }

  findOpenButton(): ButtonWrapper | null {
    const wrapper = createWrapper();
    return wrapper.findComponent(`.${testUtilStyles['open-button']}`, ButtonWrapper);
  }

  findSlider(): ElementWrapper | null {
    return this.findByClassName(testUtilStyles.slider);
  }

  /**
   * Returns the same panel if it's currently open in bottom position. If not, it returns null.
   * Use this method to assert the panel position.
   */
  findOpenPanelBottom(): SplitPanelWrapper | null {
    return this.matches(`.${testUtilStyles['open-position-bottom']}`);
  }

  /**
   * Returns the same panel if it's currently open in side position. If not, it returns null.
   * Use this method to assert the panel position.
   */
  findOpenPanelSide(): SplitPanelWrapper | null {
    return this.matches(`.${testUtilStyles['open-position-side']}`);
  }
}
