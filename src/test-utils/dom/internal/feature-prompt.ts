// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import PopoverWrapper from '../popover';

import styles from '../../../internal/do-not-use/feature-prompt/styles.selectors.js';

export default class FeaturePromptWrapper extends PopoverWrapper {
  static rootSelector: string = styles.root;

  findHeader() {
    return super.findHeader({ renderWithPortal: true });
  }

  findContent() {
    return super.findContent({ renderWithPortal: true });
  }

  findDismissButton() {
    return super.findDismissButton({ renderWithPortal: true });
  }
}
