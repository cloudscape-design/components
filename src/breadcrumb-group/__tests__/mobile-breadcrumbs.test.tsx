// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import BreadcrumbGroup, { BreadcrumbGroupProps } from '../../../lib/components/breadcrumb-group';
import createWrapper from '../../../lib/components/test-utils/dom';

import dropdownItemStyles from '../../../lib/components/button-dropdown/item-element/styles.css.js';

const renderBreadcrumbGroup = (props: BreadcrumbGroupProps) => {
  const renderResult = render(<BreadcrumbGroup {...props} />);
  return { wrapper: createWrapper(renderResult.container).findBreadcrumbGroup()!, ...renderResult };
};

jest.mock('../../../lib/components/internal/hooks/use-mobile', () => ({
  ...jest.requireActual('../../../lib/components/internal/hooks/use-mobile'),
  useMobile: jest.fn().mockReturnValue(true),
}));

describe('Mobile BreadcrumbGroup Component', () => {
  const defaultProps = {
    items: [
      { text: 'Service home', href: '#' },
      { text: 'Another page', href: '#' },
      { text: 'A long page title for a media folder', href: '#' },
      { text: 'Resource bucket 123456789', href: '#' },
    ],
  };

  test('renders correctly (dropdown closed)', () => {
    const { wrapper } = renderBreadcrumbGroup(defaultProps);

    const button = wrapper.findDropdown()!.findNativeButton().getElement();

    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-haspopup', 'true');
    expect(button).toHaveTextContent('Resource bucket 123456789');
  });

  test('renders correctly (dropdown open)', () => {
    const { wrapper } = renderBreadcrumbGroup(defaultProps);

    const button = wrapper.findDropdown()!.findNativeButton();
    button.click();

    expect(button.getElement()).toHaveAttribute('aria-expanded', 'true');
    expect(wrapper.findDropdown()!.findItems()).toHaveLength(defaultProps.items.length);
    for (let i = 0; i < defaultProps.items.length - 1; i++) {
      expect(
        wrapper.findDropdown()!.findItems()[i].find(`.${dropdownItemStyles['menu-item']}`)!.getElement()
      ).toHaveAttribute('href', defaultProps.items[i].href);
    }
    expect(
      wrapper
        .findDropdown()!
        .findItems()
        [defaultProps.items.length - 1].find(`.${dropdownItemStyles['menu-item']}`)!
        .getElement()
    ).not.toHaveAttribute('href');
  });

  test('with zero items', () => {
    const { wrapper } = renderBreadcrumbGroup({ items: [] });

    expect(wrapper.findDropdown()).toBeNull();
  });
});
