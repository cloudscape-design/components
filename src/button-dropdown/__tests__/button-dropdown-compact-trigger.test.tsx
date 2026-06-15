// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import InternalButtonDropdown from '../../../lib/components/button-dropdown/internal';
import { InternalButtonDropdownProps } from '../../../lib/components/button-dropdown/internal-interfaces';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/button-dropdown/styles.css.js';

const items: InternalButtonDropdownProps['items'] = [{ id: 'one', text: 'One' }];

function renderDropdown(props: Partial<InternalButtonDropdownProps>) {
  const { container } = render(<InternalButtonDropdown items={items} variant="icon" ariaLabel="Actions" {...props} />);
  return createWrapper(container).findButtonDropdown()!;
}

test('applies the compact-trigger class to the trigger button when compactTrigger is set', () => {
  const wrapper = renderDropdown({ compactTrigger: true });
  expect(wrapper.findNativeButton().getElement()).toHaveClass(styles['compact-trigger']);
});

test('does not apply the compact-trigger class by default', () => {
  const wrapper = renderDropdown({});
  expect(wrapper.findNativeButton().getElement()).not.toHaveClass(styles['compact-trigger']);
});
