// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import OptionWrapper from '../internal/option';

import newSelectors from '../../../token/test-classes/styles.selectors.js';
import legacySelectors from '../../../token-group/styles.selectors.js';

export class TokenGroupItemWrapper extends ComponentWrapper {
  static newRootSelector: string = newSelectors.root;
  static legacyRootSelector: string = legacySelectors.token;

  findOption(): OptionWrapper {
    return this.findComponent(`.${OptionWrapper.rootSelector}`, OptionWrapper)!;
  }

  findLabel(): ElementWrapper {
    return this.findOption().findLabel();
  }

  findDismiss(): ElementWrapper {
    const newSelector = newSelectors['dismiss-button'];
    const oldSelector = legacySelectors['dismiss-button'];

    return this.findAny(oldSelector, newSelector)!;
  }
}
