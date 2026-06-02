// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { activateAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import ButtonDropdown from '../../../lib/components/button-dropdown';
import Tabs, { TabsProps } from '../../../lib/components/tabs';
import createWrapper from '../../../lib/components/test-utils/dom';
import { validateComponentNameAndLabels } from '../../internal/__tests__/analytics-metadata-test-utils';

import buttonDropdownLabels from '../../../lib/components/button-dropdown/analytics-metadata/styles.css.js';
import tabsLabels from '../../../lib/components/tabs/analytics-metadata/styles.css.js';

const labels = { ...tabsLabels, ...buttonDropdownLabels };

const ariaLabel = 'tabs component';

const tabs: TabsProps['tabs'] = [
  {
    label: 'First tab label',
    id: 'first',
    content: 'First tab content area',
    dismissible: true,
    dismissLabel: 'Dismiss first tab',
    action: (
      <ButtonDropdown
        variant="icon"
        ariaLabel="Query actions for first tab"
        items={[
          { id: 'save', text: 'Save' },
          { id: 'saveAs', text: 'Save as' },
          { id: 'rename', text: 'Rename' },
        ]}
        expandToViewport={true}
      />
    ),
  },
  {
    label: 'Second tab label',
    id: 'second',
    content: 'Second tab content area',
    disabled: true,
    dismissible: true,
    dismissLabel: 'Dismiss second tab',
    action: (
      <ButtonDropdown
        variant="icon"
        ariaLabel="Query actions for second tab"
        items={[
          { id: 'save', text: 'Save' },
          { id: 'saveAs', text: 'Save as' },
          { id: 'rename', text: 'Rename' },
        ]}
        expandToViewport={true}
      />
    ),
  },
  {
    label: 'Third tab label',
    id: 'third',
    content: 'Third tab content area',
  },
  {
    label: 'Fourth tab label',
    id: 'fourth',
    disabled: true,
    content: 'Fourth tab content area',
  },
];

function renderTabs(props: Partial<TabsProps> = {}) {
  const renderResult = render(<Tabs ariaLabel={ariaLabel} tabs={tabs} {...props} />);
  return createWrapper(renderResult.container).findTabs()!;
}

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('Tabs renders correct analytics metadata', () => {
  test('on content', () => {
    const wrapper = renderTabs();

    const content = wrapper.findTabContent()!.getElement();
    validateComponentNameAndLabels(content, labels);
    expect(getGeneratedAnalyticsMetadata(content)).toMatchSnapshot();
  });

  test('on non-active tab', () => {
    const wrapper = renderTabs({ tabs: [tabs[0], tabs[1], tabs[2]] });

    const third = wrapper.findTabLinkById('third')!.getElement();
    validateComponentNameAndLabels(third, labels);
    expect(getGeneratedAnalyticsMetadata(third)).toMatchSnapshot();
  });

  test('on non-active disabled tab with explicit activeTabId', () => {
    const wrapper = renderTabs({ activeTabId: 'third', onChange: () => {} });

    const fourth = wrapper.findTabLinkById('fourth')!.getElement();
    validateComponentNameAndLabels(fourth, labels);
    expect(getGeneratedAnalyticsMetadata(fourth)).toMatchSnapshot();
  });

  test('on dismissible active tab with actions', () => {
    const wrapper = renderTabs();

    const first = wrapper.findTabLinkById('first')!.getElement();
    validateComponentNameAndLabels(first, labels);
    expect(getGeneratedAnalyticsMetadata(first)).toMatchSnapshot();
    const firstDismiss = wrapper.findDismissibleButtonByTabId('first')!.getElement();
    validateComponentNameAndLabels(firstDismiss, labels);
    expect(getGeneratedAnalyticsMetadata(firstDismiss)).toMatchSnapshot();
    const firstActions = wrapper.findActionByTabId('first')!.findButtonDropdown()!.findNativeButton()!.getElement();
    validateComponentNameAndLabels(firstActions, labels);
    expect(getGeneratedAnalyticsMetadata(firstActions)).toMatchSnapshot();
  });

  test('on dismissible disabled tab with actions', () => {
    const wrapper = renderTabs();

    const content = wrapper.findTabContent()!.getElement();
    validateComponentNameAndLabels(content, labels);
    expect(getGeneratedAnalyticsMetadata(content)).toMatchSnapshot();

    const second = wrapper.findTabLinkById('second')!.getElement();
    validateComponentNameAndLabels(second, labels);
    expect(getGeneratedAnalyticsMetadata(second)).toMatchSnapshot();
    const secondDismiss = wrapper.findDismissibleButtonByTabId('second')!.getElement();
    validateComponentNameAndLabels(secondDismiss, labels);
    expect(getGeneratedAnalyticsMetadata(secondDismiss)).toMatchSnapshot();
    const secondActions = wrapper.findActionByTabId('second')!.findButtonDropdown()!.findNativeButton()!.getElement();
    validateComponentNameAndLabels(secondActions, labels);
    expect(getGeneratedAnalyticsMetadata(secondActions)).toMatchSnapshot();
  });
});
