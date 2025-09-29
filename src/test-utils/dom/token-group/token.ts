// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import OptionWrapper from '../internal/option';
import TokenWrapper from '../token';

import selectors from '../../../token/styles.selectors.js';

export default class TokenGroupItemWrapper extends TokenWrapper {
  findOption(): OptionWrapper {
    return super.findOption();
  }

  findDismiss(): ElementWrapper {
    return this.findByClassName(selectors['dismiss-button'])!;
  }
}
