// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import PopoverBody, { PopoverBodyProps } from '../../../lib/components/popover/body';

import styles from '../../../lib/components/popover/styles.selectors.js';

const defaultProps: PopoverBodyProps = {
  dismissButton: false,
  dismissAriaLabel: 'Dismiss',
  onDismiss: () => undefined,
  header: 'header',
  children: 'content',
};

function renderPopoverBody(props: Partial<PopoverBodyProps>) {
  const { container } = render(<PopoverBody {...defaultProps} {...props} />);
  const wrapper = createWrapper(container).findByClassName(styles.body)!;
  const focusLockWrapper = createWrapper(container).find('[data-focus-lock-disabled]')!;
  return { wrapper, focusLockWrapper };
}

test('has aria-modal and focus lock if focusLock=true', () => {
  const { wrapper, focusLockWrapper } = renderPopoverBody({ focusLock: true });
  expect(wrapper.getElement()!).toHaveAttribute('aria-modal', 'true');
  expect(focusLockWrapper.getElement()!).toHaveAttribute('data-focus-lock-disabled', 'false');
});

test('does not have aria-modal and focus lock if focusLock=false', () => {
  const { wrapper, focusLockWrapper } = renderPopoverBody({ focusLock: false });
  expect(wrapper.getElement()!).not.toHaveAttribute('aria-modal');
  expect(focusLockWrapper.getElement()!).toHaveAttribute('data-focus-lock-disabled', 'disabled');
});
