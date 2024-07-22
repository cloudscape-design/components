// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import DropdownFooter from '../../../../../lib/components/internal/components/dropdown-footer';
import DropdownWrapper from '../../../../../lib/components/test-utils/dom/internal/dropdown';

import dropdownFooterStyles from '../../../../../lib/components/internal/components/dropdown-footer/styles.css.js';

const renderComponent = (jsx: React.ReactElement) => {
  const { container } = render(jsx);
  const wrapper = new DropdownWrapper(container);
  return { wrapper };
};

describe('Dropdown footer', () => {
  test('renders given content', () => {
    const { wrapper } = renderComponent(<DropdownFooter content="hello world" />);
    const element = wrapper.find('div')!.getElement();
    expect(element).toHaveTextContent('hello world');
    expect(element).toHaveClass(dropdownFooterStyles.root);
    expect(element).not.toHaveClass(dropdownFooterStyles.hidden);
  });

  test('adds hidden class when given content is null', () => {
    const { wrapper } = renderComponent(<DropdownFooter content={null} />);
    const element = wrapper.find('div')!.getElement();
    expect(element).toHaveClass(dropdownFooterStyles.root);
    expect(element).toHaveClass(dropdownFooterStyles.hidden);
  });

  test('adds correct aria attributes', () => {
    const { wrapper } = renderComponent(<DropdownFooter />);
    const element = wrapper.find('span')!.getElement();
    expect(element.firstElementChild).toHaveAttribute('aria-live', 'polite');
    expect(element.firstElementChild).toHaveAttribute('aria-atomic', 'true');
  });
});
