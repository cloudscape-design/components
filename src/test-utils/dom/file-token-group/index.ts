// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import selectors from '../../../file-input/styles.selectors.js';
import formFieldStyles from '../../../form-field/styles.selectors.js';

export default class FileTokenGroupWrapper extends ComponentWrapper {
  findFileTokens(): Array<FileTokenWrapper> {
    return this.findAllByClassName(FileTokenWrapper.rootSelector).map(
      fileTokenElement => new FileTokenWrapper(fileTokenElement.getElement())
    );
  }

  /**
   * Returns a file token from the group for a given index.
   *
   * @param tokenIndex 1-based index of the token to return.
   */
  findFileToken(tokenIndex: number): FileTokenWrapper | null {
    return this.findComponent(
      `.${selectors['list-item']}:nth-child(${tokenIndex}) > .${FileTokenWrapper.rootSelector}`,
      FileTokenWrapper
    );
  }
}

export class FileTokenWrapper extends ComponentWrapper {
  static rootSelector: string = selectors.token;

  findFileName(): ElementWrapper {
    return this.findByClassName(selectors['file-token-name'])!;
  }

  findFileSize(): ElementWrapper {
    return this.findByClassName(selectors['file-token-size'])!;
  }

  findFileLastModified(): ElementWrapper {
    return this.findByClassName(selectors['file-token-last-modified'])!;
  }

  findFileThumbnail(): ElementWrapper {
    return this.findByClassName(selectors['file-token-thumbnail'])!;
  }

  findFileError(): ElementWrapper {
    return this.find(`.${formFieldStyles.error} .${formFieldStyles.error__message}`)!;
  }

  findFileWarning(): ElementWrapper {
    return this.find(`.${formFieldStyles.warning} .${formFieldStyles.warning__message}`)!;
  }

  findFileDismiss(): ElementWrapper {
    return this.findByClassName(selectors['dismiss-button'])!;
  }
}
