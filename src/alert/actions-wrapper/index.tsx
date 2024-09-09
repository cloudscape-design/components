// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import InternalButton, { InternalButtonProps } from '../../button/internal';
import { GeneratedAnalyticsMetadataAlertButtonClick } from '../analytics-metadata/interfaces';

import styles from './styles.css.js';

function createActionButton(
  testUtilClasses: ActionsWrapperProps['testUtilClasses'],
  action: React.ReactNode,
  buttonText: React.ReactNode,
  onButtonClick: InternalButtonProps['onClick']
) {
  if (!action && buttonText) {
    action = (
      <span
        {...getAnalyticsMetadataAttribute({
          action: 'buttonClick',
        } as Partial<GeneratedAnalyticsMetadataAlertButtonClick>)}
      >
        <InternalButton className={testUtilClasses.actionButton} onClick={onButtonClick} formAction="none">
          {buttonText}
        </InternalButton>
      </span>
    );
  }
  return action ? <div className={testUtilClasses.actionSlot}>{action}</div> : null;
}

interface ActionsWrapperProps {
  className: string;
  testUtilClasses: { actionSlot: string; actionButton: string };
  action: React.ReactNode;
  discoveredActions: Array<React.ReactNode>;
  buttonText: React.ReactNode;
  onButtonClick: InternalButtonProps['onClick'];
}

export function ActionsWrapper({
  className,
  testUtilClasses,
  action,
  discoveredActions,
  buttonText,
  onButtonClick,
}: ActionsWrapperProps) {
  const actionButton = createActionButton(testUtilClasses, action, buttonText, onButtonClick);
  if (!actionButton && discoveredActions.length === 0) {
    return null;
  }

  return (
    <div className={clsx(styles.root, className)}>
      {actionButton}
      {discoveredActions}
    </div>
  );
}
