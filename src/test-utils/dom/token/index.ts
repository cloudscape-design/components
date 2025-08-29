// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import OptionWrapper from '../internal/option';

import selectors from '../../../token/styles.selectors.js';

export default class TokenWrapper extends ComponentWrapper {
  static rootSelector: string = selectors.root;

  private findOption(): OptionWrapper {
    return this.findComponent(`.${OptionWrapper.rootSelector}`, OptionWrapper)!;
  }

  /**
   * Returns the token label.
   */
  findLabel(): ElementWrapper | null {
    return this.findOption().findLabel();
  }

  /**
   * Returns the token label tag.
   */
  findLabelTag(): ElementWrapper | null {
    return this.findOption().findLabelTag();
  }

  /**
   * Returns the token description.
   */
  findDescription(): ElementWrapper | null {
    return this.findOption().findDescription();
  }

  /**
   * Returns the token tags.
   */
  findTags(): Array<ElementWrapper> {
    return this.findOption().findTags();
  }

  /**
   * Returns the token dismiss button.
   */
  findDismiss(): ElementWrapper | null {
    return this.findByClassName(selectors['dismiss-button'])!;
  }
}
