// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ComponentWrapper } from '@cloudscape-design/test-utils-core/dom';
import splitButtonStyles from '../../../split-button/styles.selectors.js';
import ButtonWrapper from '../button';
import ButtonDropdownWrapper from '../button-dropdown';

export default class SplitButtonDropdownWrapper extends ComponentWrapper {
  static rootSelector: string = splitButtonStyles.root;

  findItems(): Array<SplitButtonItemWrapper> {
    return this.findAll(`.${splitButtonStyles['segment-wrapper']}`).map(
      w => new SplitButtonItemWrapper(w.getElement())
    );
  }

  findItemById(id: string): null | SplitButtonItemWrapper {
    const itemSelector = `.${splitButtonStyles['segment-wrapper']}[data-testid="${id}"]`;
    const segment = this.find(itemSelector);
    return segment ? new SplitButtonItemWrapper(segment.getElement()) : null;
  }
}

export class SplitButtonItemWrapper extends ComponentWrapper {
  findButtonType(): null | ButtonWrapper {
    return this.findComponent(`.${ButtonWrapper.rootSelector}`, ButtonWrapper);
  }

  findButtonDropdownType(): null | ButtonDropdownWrapper {
    return this.findComponent(`.${ButtonDropdownWrapper.rootSelector}`, ButtonDropdownWrapper);
  }
}
