// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import formFieldStyles from '../../../form-field/styles.selectors.js';
import selectors from '../../../internal/components/file-token-group/styles.selectors.js';
import testSelectors from '../../../internal/components/file-token-group/test-classes/styles.selectors.js';
import tokenGroupSelectors from '../../../token-group/styles.selectors.js';

export default class FileTokenGroupWrapper extends ComponentWrapper {
  static rootSelector: string = testSelectors.root;

  findFileTokens(): Array<FileTokenWrapper> {
    return this.findAllByClassName(selectors.token).map(
      tokenElement => new FileTokenWrapper(tokenElement.getElement())
    );
  }

  /**
   * Returns a file token from for a given index.
   *
   * @param tokenIndex 1-based index of the file token to return.
   */
  findFileToken(fileTokenIndex: number): null | FileTokenWrapper {
    return this.findComponent(`.${selectors.token}[data-index="${fileTokenIndex - 1}"]`, FileTokenWrapper);
  }
}

export class FileTokenWrapper extends ComponentWrapper {
  static rootSelector: string = selectors.token;

  findFileName(): ElementWrapper {
    return this.findByClassName(selectors['file-option-name'])!;
  }

  findFileSize(): ElementWrapper {
    return this.findByClassName(selectors['file-option-size'])!;
  }

  findFileLastModified(): ElementWrapper {
    return this.findByClassName(selectors['file-option-last-modified'])!;
  }

  findFileThumbnail(): ElementWrapper {
    return this.findByClassName(selectors['file-option-thumbnail'])!;
  }

  findFileError(): ElementWrapper {
    return this.find(`.${formFieldStyles.error} .${formFieldStyles.error__message}`)!;
  }

  findFileWarning(): ElementWrapper {
    return this.find(`.${formFieldStyles.warning} .${formFieldStyles.warning__message}`)!;
  }

  findRemoveButton(): ElementWrapper {
    return this.findByClassName(tokenGroupSelectors['dismiss-button'])!;
  }
}
