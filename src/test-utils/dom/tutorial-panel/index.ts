// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import ButtonWrapper from '../button';
import ExpandableSectionWrapper from '../expandable-section';
import LinkWrapper from '../link';
import TutorialItemWrapper from './tutorial';

import detailStyles from '../../../tutorial-panel/components/tutorial-detail-view/styles.selectors.js';
import listStyles from '../../../tutorial-panel/components/tutorial-list/styles.selectors.js';
import styles from '../../../tutorial-panel/styles.selectors.js';

export default class TutorialPanelWrapper extends ComponentWrapper {
  static rootSelector: string = styles['tutorial-panel'];

  findTutorials(): Array<TutorialItemWrapper> {
    return this.findAllByClassName(listStyles['tutorial-box']).map(item => new TutorialItemWrapper(item.getElement()));
  }

  findDownloadLink(): LinkWrapper | null {
    return this.findComponent(`.${listStyles['download-link']}`, LinkWrapper);
  }

  findTaskList(): Array<TutorialTaskWrapper> {
    return this.findAllByClassName(detailStyles.task).map(item => new TutorialTaskWrapper(item.getElement()));
  }

  findDismissButton(): ButtonWrapper | null {
    return this.findComponent(`.${detailStyles['dismiss-button']}`, ButtonWrapper);
  }

  findCompletionScreenTitle(): ElementWrapper | null {
    return this.findByClassName(detailStyles['completion-screen-title']);
  }

  findCompletionScreenDescription(): ElementWrapper | null {
    return this.findByClassName(detailStyles['completion-screen-description']);
  }

  findFeedbackLink(): LinkWrapper | null {
    return this.findComponent(`.${detailStyles['feedback-link']}`, LinkWrapper);
  }
}

class TutorialTaskWrapper extends ComponentWrapper {
  findTitle(): ElementWrapper {
    return this.findByClassName(detailStyles['task-title'])!;
  }
  findStepsTitle(): ElementWrapper {
    return this.findComponent(`.${detailStyles['expandable-section-wrapper']}`, ExpandableSectionWrapper)!.findHeader();
  }
  findSteps(): Array<ElementWrapper> {
    return this.findAllByClassName(detailStyles['step-title']);
  }
}
