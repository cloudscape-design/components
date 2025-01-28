// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';

import { Button } from '~components';

import styles from './styles.scss';

export default function FeedbackDialog({
  children,
  footer,
  onDismiss,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
  onDismiss: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Store the element that had focus before dialog opened
    triggerRef.current = document.activeElement as HTMLElement;

    // Focus the dialog container when it opens
    if (dialogRef.current) {
      dialogRef.current.focus();
    }
    // Cleanup: Return focus to the trigger element when dialog closes
    return () => {
      if (triggerRef.current) {
        triggerRef.current.focus();
      }
    };
  }, []);

  return (
    <div
      ref={dialogRef}
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
