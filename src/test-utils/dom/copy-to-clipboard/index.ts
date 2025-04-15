// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import ButtonWrapper from '../button';
import PopoverWrapper from '../popover';

import testStyles from '../../../copy-to-clipboard/test-classes/styles.selectors.js';

export default class CopyToClipboardWrapper extends ComponentWrapper {
  static rootSelector: string = testStyles.root;

  findCopyButton(): ButtonWrapper {
    return this.findComponent(`.${ButtonWrapper.rootSelector}`, ButtonWrapper)!;
  }

  findStatusText(options = { popoverRenderWithPortal: false }): null | ElementWrapper {
    return this.findComponent(`.${PopoverWrapper.rootSelector}`, PopoverWrapper)!.findContent({
      renderWithPortal: options.popoverRenderWithPortal,
    });
  }

  /**
   * @deprecated Use `findDisplayedText` instead.
   */
  findTextToCopy(): null | ElementWrapper {
    return this.findByClassName(testStyles['text-to-copy']);
  }

  /**
   * Used to get the text displayed next to the copy icon button when `variant='inline'`.
   * Returns either the `textToCopy` value or the `textToDisplay` value if it has been set.
   */
  findDisplayedText(): null | ElementWrapper {
    return this.findByClassName(testStyles['text-to-display']);
  }
}
