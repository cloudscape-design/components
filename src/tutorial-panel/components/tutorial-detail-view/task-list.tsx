// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useState } from 'react';

import { HotspotContext } from '../../../annotation-context/context';
import { getStepInfo } from '../../../annotation-context/utils';
import InternalBox from '../../../box/internal';
import { InternalButton } from '../../../button/internal';
import InternalSpaceBetween from '../../../space-between/internal';
import { TutorialPanelProps } from '../../interfaces';
import { Task } from './task';

import styles from './styles.css.js';

export interface TaskListProps {
  tasks: ReadonlyArray<TutorialPanelProps.Task>;
  onExitTutorial: () => void;
  currentGlobalStepIndex: HotspotContext['currentStepIndex'];
  i18nStrings: TutorialPanelProps['i18nStrings'];
}

export function TaskList({ tasks, onExitTutorial, currentGlobalStepIndex, i18nStrings }: TaskListProps) {
  const currentTaskIndex = getStepInfo(tasks, currentGlobalStepIndex ?? 0).taskIndex;
  const [expandedTasks, setExpandedTasks] = useState({ [currentTaskIndex]: true });

  const onToggleExpand = useCallback((stepIndex: number) => {
    setExpandedTasks(prevTasks => ({ ...prevTasks, [stepIndex]: !prevTasks[stepIndex] }));
  }, []);

  // When the user progresses to a different task, all tasks except this one are collapsed.
  useEffect(() => {
    setExpandedTasks({ [currentTaskIndex]: true });
  }, [currentTaskIndex]);

  return (
    <InternalSpaceBetween size="xxl">
      <ol className={styles['tutorial-list']}>
        {tasks.map((task, index) => (
          <Task
            task={task}
            key={index}
            taskIndex={index}
            currentTaskIndex={currentTaskIndex}
            expanded={expandedTasks[index] ?? false}
            onToggleExpand={onToggleExpand}
            i18nStrings={i18nStrings}
          />
        ))}
      </ol>
      <InternalBox margin={{ top: 'xxxs' }}>
        <InternalButton onClick={onExitTutorial} formAction="none" className={styles['dismiss-button']}>
          {i18nStrings.dismissTutorialButtonText}
        </InternalButton>
      </InternalBox>
    </InternalSpaceBetween>
  );
}
