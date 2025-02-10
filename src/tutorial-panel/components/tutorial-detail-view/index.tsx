// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useMemo } from 'react';

import { HotspotContext } from '../../../annotation-context/context';
import InternalBox from '../../../box/internal';
import { InternalButton } from '../../../button/internal';
import { fireNonCancelableEvent } from '../../../internal/events/index';
import InternalSpaceBetween from '../../../space-between/internal';
import { TutorialPanelProps } from '../../interfaces';
import { CongratulationScreen } from './congratulation-screen';
import { TaskList } from './task-list';

import styles from './styles.css.js';

export default function TutorialDetailView({
  tutorial,
  onExitTutorial: onExitTutorialHandler,
  currentStepIndex = 0,
  onFeedbackClick: onFeedbackClickHandler,
  i18nStrings,
}: {
  tutorial: TutorialPanelProps.Tutorial;
  onExitTutorial: HotspotContext['onExitTutorial'];
  currentStepIndex: HotspotContext['currentStepIndex'];
  onFeedbackClick: TutorialPanelProps['onFeedbackClick'];
  i18nStrings: TutorialPanelProps['i18nStrings'];
}) {
  const onExitTutorial = useCallback(() => {
    fireNonCancelableEvent(onExitTutorialHandler, { tutorial });
  }, [onExitTutorialHandler, tutorial]);

  const onFeedbackClick = useMemo(
    () => onFeedbackClickHandler && (() => fireNonCancelableEvent(onFeedbackClickHandler, { tutorial })),
    [onFeedbackClickHandler, tutorial]
  );

  return (
    <>
      <InternalSpaceBetween size="xl">
        <div className={styles['tutorial-title']}>
          <InternalButton
            variant="icon"
            onClick={onExitTutorial}
            ariaLabel={i18nStrings.labelExitTutorial}
            formAction="none"
            iconName="arrow-left"
          />

          <InternalBox variant="h2" fontSize={'heading-m'} padding={{ top: 'xxs' }} margin={{ left: 's' }}>
            {tutorial.title}
          </InternalBox>
        </div>
        <div>
          <div role="status">
            {tutorial.completed && (
              <CongratulationScreen onFeedbackClick={onFeedbackClick} i18nStrings={i18nStrings}>
                {tutorial.completedScreenDescription}
              </CongratulationScreen>
            )}
          </div>
          {!tutorial.completed && (
            <TaskList
              tasks={tutorial.tasks}
              onExitTutorial={onExitTutorial}
              currentGlobalStepIndex={currentStepIndex}
              i18nStrings={i18nStrings}
            />
          )}
        </div>
      </InternalSpaceBetween>
    </>
  );
}
