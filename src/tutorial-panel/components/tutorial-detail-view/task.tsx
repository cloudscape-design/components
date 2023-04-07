// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback } from 'react';
import styles from './styles.css.js';
import { TutorialPanelProps } from '../../interfaces';
import InternalBox from '../../../box/internal';
import InternalStatusIndicator from '../../../status-indicator/internal';
import InternalSpaceBetween from '../../../space-between/internal';
import InternalExpandableSection from '../../../expandable-section/internal';
import { joinStrings } from '../../../internal/utils/strings/join-strings.js';

function getStatusIndicatorType(taskIndex: number, currentTaskIndex: number) {
  if (taskIndex < currentTaskIndex) {
    return 'success';
  }
  if (taskIndex === currentTaskIndex) {
    return 'in-progress';
  }
  return 'pending';
}

interface TaskProps {
  task: TutorialPanelProps.Task;
  taskIndex: number;
  currentTaskIndex: number;
  expanded: boolean;
  onToggleExpand: (step: number) => void;
  i18nStrings: TutorialPanelProps['i18nStrings'];
}

export function Task({ task, taskIndex, currentTaskIndex, expanded, onToggleExpand, i18nStrings }: TaskProps) {
  const statusIndicatorType = getStatusIndicatorType(taskIndex, currentTaskIndex);

  const onExpandChange = useCallback(() => {
    onToggleExpand(taskIndex);
  }, [onToggleExpand, taskIndex]);

  return (
    <li className={styles.task}>
      <InternalSpaceBetween size="xxs">
        <div className={styles['task-title']}>
          <InternalStatusIndicator
            __size="inherit"
            type={statusIndicatorType}
            iconAriaLabel={i18nStrings.labelsTaskStatus[statusIndicatorType]}
            className={styles['task-title--status']}
          />

          <InternalBox
            variant="h3"
            padding={{ left: 'xxxs', vertical: 'n' }}
            fontSize="heading-s"
            color={taskIndex < currentTaskIndex ? 'text-status-success' : 'text-status-inactive'}
          >
            {i18nStrings.taskTitle(taskIndex, task.title)}
          </InternalBox>
        </div>

        <div className={styles['expandable-section-wrapper']}>
          <InternalExpandableSection
            header={
              <span className={styles['expandable-section-header']}>
                {i18nStrings.labelTotalSteps(task.steps.length)}
              </span>
            }
            expanded={expanded}
            onChange={onExpandChange}
            headerAriaLabel={joinStrings(
              i18nStrings.taskTitle(taskIndex, task.title),
              i18nStrings.labelTotalSteps(task.steps.length)
            )}
          >
            <ol className={styles['step-list']}>
              {task.steps.map((step, stepIndex) => (
                <li key={stepIndex} className={styles.step}>
                  <InternalBox
                    color="text-body-secondary"
                    fontSize="body-m"
                    padding={{ left: 'l' }}
                    className={styles['step-title']}
                  >
                    {i18nStrings.stepTitle(stepIndex, step.title)}
                  </InternalBox>
                </li>
              ))}
            </ol>
          </InternalExpandableSection>
        </div>
      </InternalSpaceBetween>
    </li>
  );
}
