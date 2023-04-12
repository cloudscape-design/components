// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import selectors from '../../../file-upload/styles.selectors.js';
import tokenGroupSelectors from '../../../token-group/styles.selectors.js';
import tokenListSelectors from '../../../internal/components/token-list/styles.selectors.js';
import formFieldStyles from '../../../form-field/styles.selectors.js';
import ButtonWrapper from '../button';

export default class FileUploadWrapper extends ComponentWrapper<HTMLElement> {
  static rootSelector: string = selectors.root;

  findUploadButton(): ButtonWrapper {
    return this.findComponent(`.${selectors['upload-button']}`, ButtonWrapper)!;
  }

  findNativeInput(): ElementWrapper<HTMLInputElement> {
    return this.findByClassName(selectors['upload-input'])!;
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
    if (fileTokenIndex === 1) {
      return this.findComponent(`.${tokenGroupSelectors.token}`, FileTokenWrapper);
    }
    return this.findComponent(
      `.${tokenListSelectors['list-item']}:nth-child(${fileTokenIndex}) .${tokenGroupSelectors.token}`,
      FileTokenWrapper
    );
  }

  /**
   * Returns the token toggle button.
   */
  findTokenToggle(): null | ElementWrapper {
    return this.findByClassName(tokenListSelectors.toggle);
  }

  findConstraint(): null | ElementWrapper {
    return this.find(`.${selectors.hints} .${formFieldStyles.constraint}`);
  }

  findError(): null | ElementWrapper {
    return this.find(`.${selectors.hints} .${formFieldStyles.error} .${formFieldStyles.error__message}`);
  }
}

class FileTokenWrapper extends ComponentWrapper {
  findFileName(): ElementWrapper {
    return this.findByClassName(selectors['file-option-name'])!;
  }

  findFileSize(): null | ElementWrapper {
    return this.findByClassName(selectors['file-option-size']);
  }

  findFileLastModified(): null | ElementWrapper {
    return this.findByClassName(selectors['file-option-last-modified']);
  }

  findFileThumbnail(): null | ElementWrapper {
    return this.findByClassName(selectors['file-option-thumbnail-image']);
  }

  findFileError(): null | ElementWrapper {
    return this.find(`.${formFieldStyles.error} .${formFieldStyles.error__message}`);
  }

  findRemoveButton(): ElementWrapper {
    return this.findByClassName(tokenGroupSelectors['dismiss-button'])!;
  }
}
