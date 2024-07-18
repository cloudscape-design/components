// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import createWrapper from '../';
import ButtonWrapper from '../button';
import InputWrapper from '../input';
import ModalWrapper from '../modal';
import SelectWrapper from '../select';
import TableWrapper from '../table';

import inContextStyles from '../../../s3-resource-selector/s3-in-context/styles.selectors.js';
import modalStyles from '../../../s3-resource-selector/s3-modal/styles.selectors.js';
import styles from '../../../s3-resource-selector/styles.selectors.js';

class S3ModalWrapper extends ModalWrapper {
  findSubmitButton(): ButtonWrapper {
    return this.findComponent(`.${modalStyles['submit-button']}`, ButtonWrapper)!;
  }
}

class S3InContextWrapper extends ComponentWrapper {
  findUriInput(): InputWrapper {
    return this.findComponent(`.${inContextStyles['layout-uri']}`, InputWrapper)!;
  }

  findVersionsSelect(): SelectWrapper | null {
    const select = this.findByClassName(inContextStyles['layout-version']);
    return select && select.findSelect();
  }

  findViewButton(): ButtonWrapper {
    return this.findComponent(`.${inContextStyles['view-button']}`, ButtonWrapper)!;
  }

  findBrowseButton(): ButtonWrapper {
    return this.findComponent(`.${inContextStyles['browse-button']}`, ButtonWrapper)!;
  }
}

export default class S3ResourceSelectorWrapper extends ComponentWrapper {
  static rootSelector = styles.root;

  findAlertSlot(): ElementWrapper | null {
    return this.findByClassName(styles.alert);
  }

  findInContext(): S3InContextWrapper {
    return this.findComponent(`.${inContextStyles.root}`, S3InContextWrapper)!;
  }

  findModal(): S3ModalWrapper | null {
    const modal = createWrapper().findModal();
    return modal && new S3ModalWrapper(modal.getElement());
  }

  findTable(): TableWrapper | null {
    const modal = this.findModal();
    return modal && modal.findComponent(`.${TableWrapper.rootSelector}`, TableWrapper);
  }
}
