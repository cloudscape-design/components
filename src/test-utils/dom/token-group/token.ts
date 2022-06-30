// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper, ComponentWrapper } from '@cloudscape-design/test-utils-core/dom';
import selectors from '../../../token-group/styles.selectors.js';
import OptionWrapper from '../internal/option';

export default class TokenWrapper extends ComponentWrapper {
  static rootSelector: string = selectors.token;
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
