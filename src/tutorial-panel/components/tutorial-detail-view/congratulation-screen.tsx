// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import InternalBox from '../../../box/internal.js';
import InternalLink from '../../../link/internal.js';
import InternalSpaceBetween from '../../../space-between/internal.js';
import InternalStatusIndicator from '../../../status-indicator/internal.js';
import { TutorialPanelProps } from '../../interfaces.js';

import styles from './styles.css.js';

interface CongratulationScreenProps {
  children: React.ReactNode;
  onFeedbackClick?: () => void;
  i18nStrings: TutorialPanelProps['i18nStrings'];
}

export function CongratulationScreen({ children, onFeedbackClick, i18nStrings }: CongratulationScreenProps) {
  return (
    <InternalSpaceBetween size="xxl">
      <InternalSpaceBetween size="xl">
        <div className={styles['congratulation-message']}>
          <InternalStatusIndicator
            __size="inherit"
            type="success"
            className={styles['congratulation-message--status']}
          />
          <div className={styles['completion-screen-title']}>{i18nStrings.completionScreenTitle}</div>
        </div>
        <InternalBox color="text-body-secondary">
          <div
            className={clsx({
              [styles['completion-screen-description']]: true,
              [styles['plaintext-congratulation-description']]: typeof children === 'string',
            })}
          >
            {children}
          </div>
        </InternalBox>
      </InternalSpaceBetween>

      <div className={styles.divider} />

      {onFeedbackClick && (
        <InternalLink onFollow={onFeedbackClick} className={styles['feedback-link']} variant="primary">
          {i18nStrings.feedbackLinkText}
        </InternalLink>
      )}
    </InternalSpaceBetween>
  );
}
