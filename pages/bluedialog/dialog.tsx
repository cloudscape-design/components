// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Button } from '~components';

import styles from './styles.scss';

const FeedbackDialog = React.forwardRef(
  (
    {
      children,
      footer,
      onDismiss,
    }: {
      children: React.ReactNode;
      footer: React.ReactNode;
      onDismiss: () => void;
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        className={styles['feedback-dialog']}
        role="dialog"
        aria-label="Feedback dialog"
        aria-modal="false" // Maintains natural focus flow since it's an inline dialog
        tabIndex={-1} // This allows the dialog to receive focus
      >
        <div className={styles.content}>
          <div className={styles.dismiss}>
            <Button iconName="close" variant="icon" onClick={onDismiss} ariaLabel="Close dialog" />
          </div>

          <div className={styles['inner-content']}>{children}</div>
        </div>

        <div className={styles.footer}>{footer}</div>
      </div>
    );
  }
);

export default FeedbackDialog;
