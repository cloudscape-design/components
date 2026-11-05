// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import ButtonDropdown from '../../../lib/components/button-dropdown';
import createWrapper from '../../../lib/components/test-utils/dom';

import dropdownStyles from '../../../lib/components/dropdown/styles.css.js';

const items = [{ id: 'a', text: 'A' }];

function renderButtonDropdown(props: Record<string, unknown>) {
  const { container } = render(<ButtonDropdown items={items} {...props} />);
  return { container, wrapper: createWrapper(container).findButtonDropdown()! };
}

describe('ButtonDropdown Style API v2', () => {
  test('applies styleClassNames to the trigger and the dropdown', () => {
    const { container, wrapper } = renderButtonDropdown({
      styleClassNames: { trigger: 'a', dropdown: 'b', unknown: 'c' },
    });
    expect(wrapper.findNativeButton().getElement()).toHaveClass('a');
    wrapper.openDropdown();
    expect(container.querySelector(`.${dropdownStyles['dropdown-content-wrapper']}`)).toHaveClass('b');
    expect(container.querySelector('.c')).toBeNull();
  });

  test('applies styleClassNames to the main action and trigger of a split button', () => {
    const { wrapper } = renderButtonDropdown({
      variant: 'primary',
      mainAction: { text: 'Launch' },
      styleClassNames: { trigger: 'a', mainAction: 'b' },
    });
    expect(wrapper.findMainAction()!.getElement()).toHaveClass('b');
    expect(wrapper.findMainAction()!.getElement()).not.toHaveClass('a');
    expect(wrapper.findTriggerButton()!.getElement()).toHaveClass('a');
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const { container } = renderButtonDropdown({ styleClassNames: { trigger: 'a' } });
    expect(container.querySelector('[styleClassNames]')).toBeNull();
  });
});
