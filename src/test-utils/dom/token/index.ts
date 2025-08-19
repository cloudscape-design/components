// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import OptionWrapper from '../internal/option';
import PopoverWrapper from '../popover';

import selectors from '../../../token/styles.selectors.js';

function findOption(wrapper: TokenWrapper): OptionWrapper {
  return wrapper.findComponent(`.${OptionWrapper.rootSelector}`, OptionWrapper)!;
}

export default class TokenWrapper extends ComponentWrapper {
  static rootSelector: string = selectors.token;

  findLabel(): ElementWrapper | null {
    return findOption(this).findLabel();
  }

  findLabelTag(): ElementWrapper | null {
    return findOption(this).findLabelTag();
  }

  findDescription(): ElementWrapper | null {
    return findOption(this).findDescription();
  }

  findTags(): ElementWrapper[] | null {
    return findOption(this).findTags();
  }

  findDismiss(): ElementWrapper | null {
    return this.findByClassName(selectors['action-button'])!;
  }

  findPopover(): PopoverWrapper | null {
    return this.findComponent(`.${PopoverWrapper.rootSelector}`, PopoverWrapper);
  }
}
