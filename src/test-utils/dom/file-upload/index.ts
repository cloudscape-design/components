// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper, usesDom } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../file-upload/styles.selectors.js';
import ButtonWrapper from '../button';

export default class FileUploadWrapper extends ComponentWrapper<HTMLElement> {
  static rootSelector: string = styles.root;

  findUploadButton(): ComponentWrapper {
    return this.findComponent(`.${styles['upload-button']}`, ButtonWrapper)!;
  }

  findNativeInput(): ElementWrapper<HTMLInputElement> {
    return this.findByClassName(styles['upload-button'])!.find('input')!;
  }

  findFileTokens(): null {
    return null;
  }

  findFileTokenByName(fileName: string): null {
    return null;
  }
}

class FileTokenWrapper extends ElementWrapper {
  findFileName(): null {
    return null;
  }

  findFileType(): null {
    return null;
  }

  findFileSize(): null {
    return null;
  }

  findFileLastUpdateTimestamp(): null {
    return null;
  }

  findFileThumbnail(): null {
    return null;
  }

  findRemoveButton(): null {
    return null;
  }

  findActivateNameEditButton(): null {
    return null;
  }

  findSubmitNameEditButton(): null {
    return null;
  }

  findCancelNameEditButton(): null {
    return null;
  }

  findNameEditInput(): null {
    return null;
  }

  @usesDom
  isNameEditingActive(): boolean {
    return false;
  }
}
