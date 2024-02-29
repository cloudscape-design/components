// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import styles from '../../../form-field/styles.selectors.js';

export default class FormFieldWrapper extends ComponentWrapper<HTMLElement> {
  static rootSelector: string = styles.root;

  findControl(): ElementWrapper | null {
    return this.findByClassName(styles.control);
  }

  findLabel(): ElementWrapper | null {
    return this.findByClassName(styles.label);
  }

  findInfo(): ElementWrapper | null {
    return this.findByClassName(styles.info);
  }

  findConstraint(): ElementWrapper | null {
    return this.find(`:scope > .${styles.hints} .${styles.constraint}`);
  }

  findError(): ElementWrapper | null {
    return this.find(`:scope > .${styles.hints} .${styles.error} .${styles.error__message}`);
  }

  findWarning(): ElementWrapper | null {
    return this.find(`:scope > .${styles.hints} .${styles.warning} .${styles.warning__message}`);
  }

  findDescription(): ElementWrapper | null {
    return this.findByClassName(styles.description);
  }

  findSecondaryControl(): ElementWrapper | null {
    return this.findByClassName(styles['secondary-control']);
  }
}
