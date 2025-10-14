// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import OptionWrapper from '../internal/option';

import selectors from '../../../token/test-classes/styles.selectors.js';
import legacySelectors from '../../../token-group/styles.selectors.js';

export class TokenGroupItemWrapper extends ComponentWrapper {
  findOption(): OptionWrapper {
    return this.findComponent(`.${OptionWrapper.rootSelector}`, OptionWrapper)!;
  }

  findLabel(): ElementWrapper {
    return this.findOption().findLabel();
  }

  findDismiss(): ElementWrapper {
    const selector = selectors['dismiss-button'];
    const legacySelector = legacySelectors['dismiss-button'];

    return this.find(`:is(.${legacySelector}, .${selector})`)!;
  }
}
