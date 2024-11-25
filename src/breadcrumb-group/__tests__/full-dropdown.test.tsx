// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { FullDropdown } from '../../../lib/components/breadcrumb-group/full-dropdown.js';
import createWrapper, { ButtonDropdownWrapper } from '../../../lib/components/test-utils/dom';

const items = [
  {
    text: 'Breadcrumb text',
    href: 'http://amazon.com',
  },
  {
    text: '',
    href: '',
  },
  {
    text: 'Last item',
    href: '#',
  },
];
describe('FullDropdown', () => {
  let wrapper: ButtonDropdownWrapper;
  beforeEach(() => {
    const { container } = render(<FullDropdown items={items} onClick={jest.fn()} onFollow={jest.fn()} />);
    wrapper = createWrapper(container).findButtonDropdown()!;
  });

  it('should render last item', () => {
    expect(wrapper.findNativeButton().getElement()).toHaveTextContent('Last item');
  });
  it('should show all items on click', () => {
    wrapper.findNativeButton()!.click();
    expect(wrapper.findItems().length).toBe(3);
  });
  it('should render last item without link', () => {
    wrapper.findNativeButton()!.click();
    expect(wrapper.findItems()[2].getElement().querySelector('a')).toBeFalsy();
  });
  it('should render other items with link', () => {
    wrapper.findNativeButton()!.click();
    expect(wrapper.findItems()[0].getElement().querySelector('a')).toHaveAttribute('href', items[0].href);
  });
});
