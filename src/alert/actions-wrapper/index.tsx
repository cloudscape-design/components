// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useLayoutEffect } from 'react';
import clsx from 'clsx';

import { getIsRtl } from '@cloudscape-design/component-toolkit/internal';
import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import InternalButton, { InternalButtonProps } from '../../button/internal';
import { GeneratedAnalyticsMetadataAlertButtonClick } from '../analytics-metadata/interfaces';

import styles from './styles.css.js';

export const useActionsWrappingDetection = (containerWidth: number, style: string) => {
  const actionsRef = React.useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!actionsRef.current) {
      return;
    }
    const isRtl = getIsRtl(actionsRef.current);
    const { offsetWidth, offsetLeft } = actionsRef.current;
    const start = isRtl ? containerWidth - offsetWidth - offsetLeft : offsetLeft;
    // if the action slot is towards the left (right in RTL) of its container
    if (start < 100) {
      actionsRef.current.classList.add(style);
    } else {
      actionsRef.current.classList.remove(style);
    }
  }, [containerWidth, style]);
  return actionsRef;
};

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

export const ActionsWrapper = forwardRef<HTMLDivElement, ActionsWrapperProps>(
  ({ className, testUtilClasses, action, discoveredActions, buttonText, onButtonClick }, ref) => {
    const actionButton = createActionButton(testUtilClasses, action, buttonText, onButtonClick);
    if (!actionButton && discoveredActions.length === 0) {
      return null;
    }

    return (
      <div ref={ref} className={clsx(styles.root, className)}>
        {actionButton}
        {discoveredActions}
      </div>
    );
  }
);
