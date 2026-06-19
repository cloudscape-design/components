// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { TopNavigationProps } from '../../../lib/components/top-navigation';
import { renderTopNavigation } from './common';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

const structuredProps: Pick<TopNavigationProps, 'identity' | 'search' | 'utilities'> = {
  identity: { href: '#', title: 'Structured' },
  search: <input placeholder="Search" />,
  utilities: [{ type: 'button', text: 'Help' }],
};

const children = <div>Custom Nav</div>;

describe('custom content - children', () => {
  test('renders children and ignores structured elements when both are provided', () => {
    const wrapper = renderTopNavigation({ ...structuredProps, children });

    expect(wrapper.findContent()!.getElement()).toHaveTextContent('Custom Nav');
    expect(wrapper.findTitle()).toBeNull();
    expect(wrapper.findIdentityLink()).toBeNull();
    expect(wrapper.findSearch()).toBeNull();
    expect(wrapper.findUtilities()).toHaveLength(0);
  });

  test('warns when children are provided alongside structured props', () => {
    renderTopNavigation({ ...structuredProps, children });

    expect(warnOnce).toHaveBeenCalledTimes(1);
    expect(warnOnce).toHaveBeenCalledWith('TopNavigation', expect.stringContaining('structured props'));
  });

  test('does not warn when only children are provided', () => {
    renderTopNavigation({ children });
    expect(warnOnce).not.toHaveBeenCalled();
  });

  test('does not warn for the structured variant', () => {
    renderTopNavigation(structuredProps);
    expect(warnOnce).not.toHaveBeenCalled();
  });
});
