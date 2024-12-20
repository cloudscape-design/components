// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import ButtonWrapper from '../button';

import selectors from '../../../file-input/styles.selectors.js';

export default class FileInputWrapper extends ComponentWrapper<HTMLElement> {
  static rootSelector: string = selectors.root;

  findTrigger(): ButtonWrapper {
    return this.findComponent(`.${selectors['file-input-button']}`, ButtonWrapper)!;
  }

  findNativeInput(): ElementWrapper<HTMLInputElement> {
    return this.findByClassName(selectors['file-input'])!;
  }
}
