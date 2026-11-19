// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React, { useContext, useRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { hotspotContext } from '../annotation-context/context';
import { useInternalI18n } from '../i18n/context';
import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { NonCancelableCustomEvent } from '../types/events';
import TutorialDetailView from './components/tutorial-detail-view';
import TutorialList from './components/tutorial-list';
import { TutorialPanelProps } from './interfaces';

import styles from './styles.css.js';

export { TutorialPanelProps };

export default function TutorialPanel({
  i18nStrings,
  loading,
  tutorials,
  onFeedbackClick,
  downloadUrl,
  ...restProps
}: TutorialPanelProps) {
  const { __internalRootRef } = useBaseComponent('TutorialPanel');
  const panelRef = useRef<HTMLDivElement>(null);
  const headingId = useUniqueId();

  const baseProps = getBaseProps(restProps);
  const context = useContext(hotspotContext);

  const i18n = useInternalI18n('tutorial-panel');
  const resolvedI18nStrings: TutorialPanelProps.I18nStrings = {
    ...i18nStrings,
    loadingText: i18n('i18nStrings.loadingText', i18nStrings.loadingText),
    tutorialListTitle: i18n('i18nStrings.tutorialListTitle', i18nStrings.tutorialListTitle),
    tutorialListDownloadLinkText: i18n(
      'i18nStrings.tutorialListDownloadLinkText',
      i18nStrings.tutorialListDownloadLinkText
    ),
    labelTutorialListDownloadLink: i18n(
      'i18nStrings.labelTutorialListDownloadLink',
      i18nStrings.labelTutorialListDownloadLink
    ),
    tutorialCompletedText: i18n('i18nStrings.tutorialCompletedText', i18nStrings.tutorialCompletedText),
    learnMoreLinkText: i18n('i18nStrings.learnMoreLinkText', i18nStrings.learnMoreLinkText),
    startTutorialButtonText: i18n('i18nStrings.startTutorialButtonText', i18nStrings.startTutorialButtonText),
    restartTutorialButtonText: i18n('i18nStrings.restartTutorialButtonText', i18nStrings.restartTutorialButtonText),
    completionScreenTitle: i18n('i18nStrings.completionScreenTitle', i18nStrings.completionScreenTitle),
    feedbackLinkText: i18n('i18nStrings.feedbackLinkText', i18nStrings.feedbackLinkText),
    dismissTutorialButtonText: i18n('i18nStrings.dismissTutorialButtonText', i18nStrings.dismissTutorialButtonText),
    labelExitTutorial: i18n('i18nStrings.labelExitTutorial', i18nStrings.labelExitTutorial),
    taskTitle: i18n(
      'i18nStrings.taskTitle',
      i18nStrings.taskTitle,
      format => (taskIndex, taskTitle) => format({ taskNumber: taskIndex + 1, taskTitle })
    ),
    stepTitle: i18n(
      'i18nStrings.stepTitle',
      i18nStrings.stepTitle,
      format => (stepIndex, stepTitle) => format({ stepNumber: stepIndex + 1, stepTitle })
    ),
    labelTotalSteps: i18n(
      'i18nStrings.labelTotalSteps',
      i18nStrings.labelTotalSteps,
      format => totalStepCount => format({ totalStepCount })
    ),
    labelsTaskStatus: {
      pending: i18n('i18nStrings.labelsTaskStatus.pending', i18nStrings.labelsTaskStatus?.pending),
      'in-progress': i18n('i18nStrings.labelsTaskStatus.in-progress', i18nStrings.labelsTaskStatus?.['in-progress']),
      success: i18n('i18nStrings.labelsTaskStatus.success', i18nStrings.labelsTaskStatus?.success),
    },
  };

  function handleExitTutorial(event: NonCancelableCustomEvent<TutorialPanelProps.TutorialDetail>) {
    context.onExitTutorial(event);
    panelRef.current?.focus();
  }

  const mergedRef = useMergeRefs(panelRef, __internalRootRef);

  return (
    <>
      <div
        {...baseProps}
        className={clsx(baseProps.className, styles['tutorial-panel'])}
        ref={mergedRef}
        tabIndex={-1}
        // Adding attributes conditionally since we don't want to point to
        // a non existent header in the aria-labelledby
        {...(!context.currentTutorial && {
          role: 'region',
          'aria-labelledby': headingId,
        })}
      >
        {context.currentTutorial ? (
          <TutorialDetailView
            i18nStrings={resolvedI18nStrings}
            tutorial={context.currentTutorial}
            onExitTutorial={handleExitTutorial}
            currentStepIndex={context.currentStepIndex}
            onFeedbackClick={onFeedbackClick}
          />
        ) : (
          <TutorialList
            i18nStrings={resolvedI18nStrings}
            tutorials={tutorials}
            loading={loading}
            onStartTutorial={context.onStartTutorial}
            downloadUrl={downloadUrl}
            headingId={headingId}
          />
        )}
      </div>
    </>
  );
}

applyDisplayName(TutorialPanel, 'TutorialPanel');
