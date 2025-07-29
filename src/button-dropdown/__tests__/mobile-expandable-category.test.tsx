// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import MobileExpandableCategoryElement from '../../../lib/components/button-dropdown/category-elements/mobile-expandable-category-element';
import MobileExpandableGroup from '../../../lib/components/button-dropdown/mobile-expandable-group/mobile-expandable-group';
import createWrapper from '../../../lib/components/test-utils/dom';

const renderComponent = (component: React.ReactElement) => {
  const renderResult = render(component);
  return createWrapper(renderResult.container);
};
describe('MobileExpandableGroup Component', () => {
  test('is closed by default', () => {
    const wrapper = renderComponent(
      <MobileExpandableGroup trigger={<button />}>
        <div />
      </MobileExpandableGroup>
    );
    expect(wrapper.find(`[data-open=true]`)).toBe(null);
  });
  test('opens with the prop', () => {
    const wrapper = renderComponent(
      <MobileExpandableGroup open={true} trigger={<button />}>
        <div />
      </MobileExpandableGroup>
    );
    expect(wrapper.find(`[data-open=true]`)).not.toBe(null);
  });
});

describe('MobileExpandableCategoryElement icon rendering', () => {
  const mockProps = {
    onItemActivate: jest.fn(),
    onGroupToggle: jest.fn(),
    targetItem: null,
    isHighlighted: jest.fn(() => false),
    isKeyboardHighlight: jest.fn(() => false),
    isExpanded: jest.fn(() => false),
    lastInDropdown: false,
    highlightItem: jest.fn(),
    disabled: false,
    variant: 'normal' as const,
    position: '1',
  };

  test('renders icon when iconName provided', () => {
    const item = { id: 'test', text: 'Test', iconName: 'settings' as const, items: [] };
    const wrapper = renderComponent(<MobileExpandableCategoryElement item={item} {...mockProps} />);
    expect(wrapper.findIcon()).toBeTruthy();
  });

  test('renders icon when iconUrl provided', () => {
    const item = { id: 'test', text: 'Test', iconUrl: 'data:image/png;base64,test', items: [] };
    const wrapper = renderComponent(<MobileExpandableCategoryElement item={item} {...mockProps} />);
    expect(wrapper.findIcon()).toBeTruthy();
  });

  test('renders icon when iconSvg provided', () => {
    const item = {
      id: 'test',
      text: 'Test',
      iconSvg: (
        <svg focusable="false">
          <circle />
        </svg>
      ),
      items: [],
    };
    const wrapper = renderComponent(<MobileExpandableCategoryElement item={item} {...mockProps} />);
    expect(wrapper.findIcon()).toBeTruthy();
  });
});
