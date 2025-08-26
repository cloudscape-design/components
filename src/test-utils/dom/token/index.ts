// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import OptionWrapper from '../internal/option';

import selectors from '../../../token/styles.selectors.js';

function findOption(wrapper: TokenWrapper): OptionWrapper {
  return wrapper.findComponent(`.${OptionWrapper.rootSelector}`, OptionWrapper)!;
}

export default class TokenWrapper extends ComponentWrapper {
  static rootSelector: string = selectors.root;

  /**
   * Returns the token label.
   */
  findLabel(): ElementWrapper | null {
    return findOption(this).findLabel();
  }

  /**
   * Returns the token label tag.
   */
  findLabelTag(): ElementWrapper | null {
    return findOption(this).findLabelTag();
  }

  /**
   * Returns the token description.
   */
  findDescription(): ElementWrapper | null {
    return findOption(this).findDescription();
  }

  /**
   * Returns the token tags.
   */
  findTags(): Array<ElementWrapper> | null {
    return findOption(this).findTags();
  }

  /**
   * Returns the token dismiss button.
   */
  findDismiss(): ElementWrapper | null {
    return this.findByClassName(selectors['dismiss-button'])!;
  }
}
