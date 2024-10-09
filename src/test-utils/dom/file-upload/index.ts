// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import ButtonWrapper from '../button';
import { FileTokenWrapper } from '../file-token-group';

import fileInputSelectors from '../../../file-input/styles.selectors.js';
import fileUploadSelectors from '../../../file-upload/test-styles/styles.selectors.js';
import formFieldStyles from '../../../form-field/styles.selectors.js';
import tokenListSelectors from '../../../internal/components/token-list/styles.selectors.js';
import tokenGroupSelectors from '../../../token-group/styles.selectors.js';

export default class FileUploadWrapper extends ComponentWrapper<HTMLElement> {
  static rootSelector: string = fileUploadSelectors.root;

  findUploadButton(): ButtonWrapper {
    return this.findComponent(`.${fileInputSelectors['upload-button']}`, ButtonWrapper)!;
  }

  findNativeInput(): ElementWrapper<HTMLInputElement> {
    return this.findByClassName(fileInputSelectors['upload-input'])!;
  }

  findFileTokens(): Array<FileTokenWrapper> {
    return this.findAllByClassName(tokenGroupSelectors.token).map(
      tokenElement => new FileTokenWrapper(tokenElement.getElement())
    );
  }

  /**
   * Returns a file token from for a given index.
   *
   * @param tokenIndex 1-based index of the file token to return.
   */
  findFileToken(fileTokenIndex: number): null | FileTokenWrapper {
    return this.findComponent(`.${tokenGroupSelectors.token}[data-index="${fileTokenIndex - 1}"]`, FileTokenWrapper);
  }

  /**
   * Returns the token toggle button.
   */
  findTokenToggle(): null | ElementWrapper {
    return this.findByClassName(tokenListSelectors.toggle);
  }

  findConstraint(): null | ElementWrapper {
    return this.find(`.${fileUploadSelectors.hints} .${formFieldStyles.constraint}`);
  }

  findError(): null | ElementWrapper {
    console.log(fileUploadSelectors.hints, formFieldStyles.error, formFieldStyles.error__message);
    return this.find(`.${fileUploadSelectors.hints} .${formFieldStyles.error} .${formFieldStyles.error__message}`);
  }

  findWarning(): null | ElementWrapper {
    return this.find(`.${fileUploadSelectors.hints} .${formFieldStyles.warning} .${formFieldStyles.warning__message}`);
  }
}
