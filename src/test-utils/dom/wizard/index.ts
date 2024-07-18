// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import ButtonWrapper from '../button';
import FormWrapper from '../form';
import HeaderWrapper from '../header';

import formStyles from '../../../form/styles.selectors.js';
import styles from '../../../wizard/styles.selectors.js';

export default class WizardWrapper extends FormWrapper {
  static rootSelector = styles.root;

  findHeader(): ElementWrapper | null {
    return this.findByClassName(styles['form-header-component']);
  }

  findInfo(): ElementWrapper | null {
    return this.findComponent(`.${styles['form-header']}`, HeaderWrapper)!.findInfo();
  }

  findCancelButton(): ButtonWrapper {
    return this.findComponent(`.${styles['cancel-button']}`, ButtonWrapper)!;
  }

  findSkipToButton(): ButtonWrapper | null {
    return this.findComponent(`.${styles['skip-to-button']}`, ButtonWrapper)!;
  }

  findPreviousButton(): ButtonWrapper | null {
    return this.findComponent(`.${styles['previous-button']}`, ButtonWrapper);
  }

  findPrimaryButton(): ButtonWrapper {
    return this.findComponent(`.${styles['primary-button']}`, ButtonWrapper)!;
  }

  findMenuNavigationLinks(): Array<ElementWrapper> {
    return this.findAllByClassName(styles['navigation-link']);
  }

  /**
   * Returns a link for a given step number.
   *
   * @param stepNumber 1-based step index
   * @param state
   *
   * [optional] State of the link. The method returns null if the specified step does not match the state. It can be
   *  - "disabled": for disabled menu entries
   *  - "active": for the active menu entry
   *  - undefined: for any entry
   */
  findMenuNavigationLink(stepNumber: number, state?: string): ElementWrapper | null {
    const additionalClassName = state ? `.${styles[`navigation-link-${state}`]}` : '';
    return this.find(
      `.${styles['navigation-link-item']}:nth-child(${stepNumber}) .${styles['navigation-link']}${additionalClassName}`
    );
  }

  findSecondaryActions(): ElementWrapper | null {
    return this.findByClassName(formStyles['secondary-actions']);
  }
}
