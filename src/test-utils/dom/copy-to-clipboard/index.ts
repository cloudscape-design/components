// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../copy-to-clipboard/test-classes/styles.selectors.js';
import ButtonWrapper from '../button';
import PopoverWrapper from '../popover';

export default class CopyToClipboardWrapper extends ComponentWrapper {
  static rootSelector: string = styles.root;

  findCopyButton(): ButtonWrapper {
    return this.findComponent(`.${ButtonWrapper.rootSelector}`, ButtonWrapper)!;
  }

  findMessage(): null | ComponentWrapper {
    return this.findComponent(`.${PopoverWrapper.rootSelector}`, PopoverWrapper)!.findContent();
  }
}
