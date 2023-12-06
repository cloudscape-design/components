// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper } from '@cloudscape-design/test-utils-core/dom';
import testStyles from '../../../copy-to-clipboard/test-classes/styles.selectors.js';
import ButtonWrapper from '../button';
import PopoverWrapper from '../popover';

export default class CopyToClipboardWrapper extends ComponentWrapper {
  static rootSelector: string = testStyles.root;

  findCopyButton(): ButtonWrapper {
    return this.findComponent(`.${ButtonWrapper.rootSelector}`, ButtonWrapper)!;
  }

  findStatusText(): null | ComponentWrapper {
    return this.findComponent(`.${PopoverWrapper.rootSelector}`, PopoverWrapper)!.findContent();
  }

  findTextToCopy(): null | ComponentWrapper {
    return this.findByClassName(testStyles['text-to-copy']);
  }
}
