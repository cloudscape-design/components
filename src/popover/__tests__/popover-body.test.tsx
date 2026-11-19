// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import PopoverBody from '../../../lib/components/popover/body';

function renderPopoverBody(disableDismissAutoFocus = false) {
  return render(
    <PopoverBody
      dismissButton={true}
      dismissAriaLabel="Close"
      disableDismissAutoFocus={disableDismissAutoFocus}
      onDismiss={() => {}}
      header={undefined}
    >
      Content
    </PopoverBody>
  );
}

describe('disableDismissAutoFocus', () => {
  it('focuses the dismiss button by default when dismissButton is true', () => {
    const { container } = renderPopoverBody();
    const dismissButton = container.querySelector('button[aria-label="Close"]');
    expect(document.activeElement).toBe(dismissButton);
  });

  it('does not focus the dismiss button when disableDismissAutoFocus is true', () => {
    const { container } = renderPopoverBody(true);
    const dismissButton = container.querySelector('button[aria-label="Close"]');
    expect(document.activeElement).not.toBe(dismissButton);
  });
});
