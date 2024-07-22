// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import ButtonWrapper from '../button';
import { AlertWrapper } from '../index.js';
import LinkWrapper from '../link';

import styles from '../../../tutorial-panel/components/tutorial-list/styles.selectors.js';

export default class TutorialItemWrapper extends ComponentWrapper {
  static rootSelector: string = styles['tutorial-box'];

  findStartButton(): ButtonWrapper | null {
    return this.findComponent(`.${styles.start}`, ButtonWrapper);
  }

  findLearnMoreLink(): LinkWrapper | null {
    return this.findComponent(`.${styles['learn-more-link']}`, LinkWrapper);
  }

  findExpandButton(): ButtonWrapper | null {
    return this.findComponent(`.${styles['expand-button']}`, ButtonWrapper);
  }

  findCollapseButton(): ButtonWrapper | null {
    return this.findComponent(`.${styles['collapse-button']}`, ButtonWrapper);
  }

  findDescription(): ElementWrapper | null {
    return this.findByClassName(styles['tutorial-description']);
  }

  findTitle(): ElementWrapper {
    return this.findByClassName(styles.title)!;
  }

  findCompleted(): ElementWrapper | null {
    return this.findByClassName(styles.completed);
  }

  findPrerequisitesAlert(): AlertWrapper | null {
    return this.findComponent(`.${styles['prerequisites-alert']}`, AlertWrapper);
  }
}
