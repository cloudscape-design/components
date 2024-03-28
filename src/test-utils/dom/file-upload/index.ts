// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import fileUploadSelectors from '../../../file-upload/styles.selectors.js';
import fileUploadInputSelectors from '../../../file-upload/file-input/styles.selectors.js';
import fileUploadOptionSelectors from '../../../file-upload/file-option/styles.selectors.js';
import tokenGroupSelectors from '../../../token-group/styles.selectors.js';
import tokenListSelectors from '../../../internal/components/token-list/styles.selectors.js';
import formFieldStyles from '../../../form-field/styles.selectors.js';
import ButtonWrapper from '../button';

export default class FileUploadWrapper extends ComponentWrapper<HTMLElement> {
  static rootSelector: string = fileUploadSelectors.root;

  findUploadButton(): ButtonWrapper {
    return this.findComponent(`.${fileUploadInputSelectors['upload-button']}`, ButtonWrapper)!;
  }

  findNativeInput(): ElementWrapper<HTMLInputElement> {
    return this.findByClassName(fileUploadInputSelectors['upload-input'])!;
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
    return this.find(`.${fileUploadSelectors.hints} .${formFieldStyles.error} .${formFieldStyles.error__message}`);
  }

  findWarning(): null | ElementWrapper {
    return this.find(`.${fileUploadSelectors.hints} .${formFieldStyles.warning} .${formFieldStyles.warning__message}`);
  }
}

class FileTokenWrapper extends ComponentWrapper {
  findFileName(): ElementWrapper {
    return this.findByClassName(fileUploadOptionSelectors['file-option-name'])!;
  }

  findFileSize(): null | ElementWrapper {
    return this.findByClassName(fileUploadOptionSelectors['file-option-size']);
  }

  findFileLastModified(): null | ElementWrapper {
    return this.findByClassName(fileUploadOptionSelectors['file-option-last-modified']);
  }

  findFileThumbnail(): null | ElementWrapper {
    return this.findByClassName(fileUploadOptionSelectors['file-option-thumbnail-image']);
  }

  findFileError(): null | ElementWrapper {
    return this.find(`.${formFieldStyles.error} .${formFieldStyles.error__message}`);
  }

  findFileWarning(): null | ElementWrapper {
    return this.find(`.${formFieldStyles.warning} .${formFieldStyles.warning__message}`);
  }

  findRemoveButton(): ElementWrapper {
    return this.findByClassName(tokenGroupSelectors['dismiss-button'])!;
  }
}
