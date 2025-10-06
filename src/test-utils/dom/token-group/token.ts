// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import OptionWrapper from '../internal/option';

import selectors from '../../../token/test-classes/styles.selectors.js';

export class TokenGroupItemWrapper extends ComponentWrapper {
  static rootSelector: string = selectors.root;

  findOption(): OptionWrapper {
    return this.findComponent(`.${OptionWrapper.rootSelector}`, OptionWrapper)!;
  }

  findLabel(): ElementWrapper {
    return this.findOption().findLabel();
  }

  findDismiss(): ElementWrapper {
    return this.findByClassName(selectors['dismiss-button'])!;
  }
}
