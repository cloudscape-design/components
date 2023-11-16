// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styles from './styles.css.js';
import { TutorialPanelProps } from '../../interfaces';
import InternalStatusIndicator from '../../../status-indicator/internal';
import InternalSpaceBetween from '../../../space-between/internal';
import InternalLink from '../../../link/internal';
import clsx from 'clsx';
import InternalBox from '../../../box/internal';

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
