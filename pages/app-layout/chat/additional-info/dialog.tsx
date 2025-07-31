// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';

import '../dialog.scss';

const Dialog = React.forwardRef(
  (
    {
      children,
      footer,
      onDismiss,
      ariaLabel,
    }: {
      children: React.ReactNode;
      footer: React.ReactNode;
      onDismiss: () => void;
      ariaLabel: string;
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        className="dialog"
        role="dialog"
        aria-label={ariaLabel}
        aria-modal="false" // Maintains natural focus flow since it's an inline dialog
        tabIndex={-1} // This allows the dialog to receive focus
      >
        <div className="content">
          <div className="dismiss">
            <Button
              iconName="close"
              variant="icon"
              onClick={onDismiss}
              ariaLabel="Close dialog"
              data-testid="dialog-dismiss-button"
            />
          </div>

          <div className="inner-content">{children}</div>
        </div>

        <div className="footer">{footer}</div>
      </div>
    );
  }
);

Dialog.displayName = 'Dialog';

export default Dialog;
