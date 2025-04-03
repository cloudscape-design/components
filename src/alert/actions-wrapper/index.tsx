// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useState } from 'react';
import clsx from 'clsx';

import { getIsRtl } from '@cloudscape-design/component-toolkit/internal';
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
  wrappedClass?: string;
  containerWidth?: number;
  onButtonClick: InternalButtonProps['onClick'];
}

export const ActionsWrapper = ({
  className,
  testUtilClasses,
  action,
  discoveredActions,
  buttonText,
  wrappedClass,
  containerWidth,
  onButtonClick,
}: ActionsWrapperProps) => {
  const [wrapped, setWrapped] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!ref.current || !containerWidth || !wrappedClass) {
      return;
    }
    const isRtl = getIsRtl(ref.current);
    const { offsetWidth, offsetLeft } = ref.current;
    const start = isRtl ? containerWidth - offsetWidth - offsetLeft : offsetLeft;
    // if the action slot is towards the left (right in RTL) of its container
    setWrapped(start < 100);
  }, [containerWidth, wrappedClass]);
  const actionButton = createActionButton(testUtilClasses, action, buttonText, onButtonClick);
  if (!actionButton && discoveredActions.length === 0) {
    return null;
  }

  return (
    <div ref={ref} className={clsx(styles.root, className, wrapped && wrappedClass)}>
      {actionButton}
      {discoveredActions}
    </div>
  );
};
