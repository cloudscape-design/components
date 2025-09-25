// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import OptionWrapper from '../internal/option';
import StandaloneTokenWrapper from '../token';

import selectors from '../../../token-group/styles.selectors.js';

export default class TokenWrapper extends StandaloneTokenWrapper {
  findOption(): OptionWrapper {
    return super.findOption();
  }

  findDismiss(): ElementWrapper {
    return this.findByClassName(selectors['dismiss-button'])!;
  }
}
