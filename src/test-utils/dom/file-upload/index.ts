// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../file-upload/styles.selectors.js';
import tokenGroupSelectors from '../../../token-group/styles.selectors.js';
import spaceBetweenSelectors from '../../../space-between/styles.selectors.js';
import tokenListSelectors from '../../../internal/components/token-list/styles.selectors.js';
import formFieldStyles from '../../../form-field/styles.selectors.js';
import ButtonWrapper from '../button';

export default class FileUploadWrapper extends ComponentWrapper<HTMLElement> {
  static rootSelector: string = styles.root;

  findUploadButton(): ButtonWrapper {
    return this.findComponent(`.${styles['upload-button']}`, ButtonWrapper)!;
  }

  findNativeInput(): ElementWrapper<HTMLInputElement> {
    return this.findByClassName(styles['upload-input'])!;
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
    return this.findComponent(
      `.${spaceBetweenSelectors.child}:nth-child(${fileTokenIndex}) > .${tokenGroupSelectors.token}`,
      FileTokenWrapper
    );
  }

  /**
   * Returns the token toggle button.
   */
  findTokenToggle(): ElementWrapper | null {
    return this.findByClassName(tokenListSelectors.toggle);
  }

  findConstraint(): ElementWrapper | null {
    return this.find(`:scope > .${formFieldStyles.hints} .${formFieldStyles.constraint}`);
  }

  findError(): ElementWrapper | null {
    return this.find(`:scope > .${formFieldStyles.hints} .${formFieldStyles.error} .${formFieldStyles.error__message}`);
  }
}

class FileTokenWrapper extends ComponentWrapper {
  findFileName(): ElementWrapper {
    return this.findByClassName(styles['file-option-name'])!;
  }

  findFileSize(): null | ElementWrapper {
    return this.findByClassName(styles['file-option-size']);
  }

  findFileLastModified(): null | ElementWrapper {
    return this.findByClassName(styles['file-option-last-modified']);
  }

  findFileThumbnail(): null | ElementWrapper {
    return this.findByClassName(styles['file-option-thumbnail-image']);
  }

  findRemoveButton(): null | ElementWrapper {
    return this.findByClassName(tokenGroupSelectors['dismiss-button']);
  }
}
