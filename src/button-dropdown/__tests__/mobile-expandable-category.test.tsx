// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

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
