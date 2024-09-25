// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  activateAnalyticsMetadata,
  GeneratedAnalyticsMetadataFragment,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
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

const getTabsComponentContexts = (activeTabIndex: number, tabIndex?: number, tabsCount = '4') => {
  const { id, label } = tabs[activeTabIndex];
  const metadata: GeneratedAnalyticsMetadataFragment = {
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.Tabs',
          label: ariaLabel,
          properties: {
            activeTabId: id,
            activeTabLabel: label as string,
            activeTabPosition: `${activeTabIndex + 1}`,
            tabsCount,
          },
        },
      },
    ],
  };
  if (tabIndex !== undefined) {
    const tab = tabs[tabIndex];
    metadata.contexts![0].detail.innerContext = {
      tabId: tab.id,
      tabLabel: tab.label as string,
      tabPosition: `${tabIndex + 1}`,
    };
  }
  return metadata;
};

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('Tabs renders correct analytics metadata', () => {
  test('on content', () => {
    const wrapper = renderTabs();

    const content = wrapper.findTabContent()!.getElement();
    validateComponentNameAndLabels(content, labels);
    expect(getGeneratedAnalyticsMetadata(content)).toEqual({ ...getTabsComponentContexts(0) });
  });

  test('on non-active tab', () => {
    const wrapper = renderTabs({ tabs: [tabs[0], tabs[1], tabs[2]] });

    const third = wrapper.findTabLinkById('third')!.getElement();
    validateComponentNameAndLabels(third, labels);
    expect(getGeneratedAnalyticsMetadata(third)).toEqual({
      action: 'select',
      detail: {
        id: 'third',
        label: 'Third tab label',
        position: '3',
        originTabId: 'first',
      },
      ...getTabsComponentContexts(0, 2, '3'),
    });
  });

  test('on non-active disabled tab with explicit activeTabId', () => {
    const wrapper = renderTabs({ activeTabId: 'third', onChange: () => {} });

    const fourth = wrapper.findTabLinkById('fourth')!.getElement();
    validateComponentNameAndLabels(fourth, labels);
    expect(getGeneratedAnalyticsMetadata(fourth)).toEqual({ ...getTabsComponentContexts(2, 3) });
  });

  test('on dismissible active tab with actions', () => {
    const wrapper = renderTabs();

    const first = wrapper.findTabLinkById('first')!.getElement();
    validateComponentNameAndLabels(first, labels);
    expect(getGeneratedAnalyticsMetadata(first)).toEqual({ ...getTabsComponentContexts(0, 0) });
    const firstDismiss = wrapper.findDismissibleButtonByTabId('first')!.getElement();
    validateComponentNameAndLabels(firstDismiss, labels);
    expect(getGeneratedAnalyticsMetadata(firstDismiss)).toEqual({
      action: 'dismiss',
      detail: {
        id: 'first',
        label: 'Dismiss first tab',
        position: '1',
      },
      ...getTabsComponentContexts(0, 0),
    });
    const firstActions = wrapper.findActionByTabId('first')!.findButtonDropdown()!.findNativeButton()!.getElement();
    validateComponentNameAndLabels(firstActions, labels);
    expect(getGeneratedAnalyticsMetadata(firstActions)).toEqual({
      action: 'expand',
      detail: {
        expanded: 'true',
        label: 'Query actions for first tab',
      },
      contexts: [
        {
          type: 'component',
          detail: {
            name: 'awsui.ButtonDropdown',
            label: 'Query actions for first tab',
            properties: {
              variant: 'icon',
              disabled: 'false',
            },
          },
        },
        ...(getTabsComponentContexts(0, 0).contexts as []),
      ],
    });
  });

  test('on dismissible disabled tab with actions', () => {
    const wrapper = renderTabs();

    const content = wrapper.findTabContent()!.getElement();
    validateComponentNameAndLabels(content, labels);
    expect(getGeneratedAnalyticsMetadata(content)).toEqual({ ...getTabsComponentContexts(0) });

    const second = wrapper.findTabLinkById('second')!.getElement();
    validateComponentNameAndLabels(second, labels);
    expect(getGeneratedAnalyticsMetadata(second)).toEqual({ ...getTabsComponentContexts(0, 1) });
    const secondDismiss = wrapper.findDismissibleButtonByTabId('second')!.getElement();
    validateComponentNameAndLabels(secondDismiss, labels);
    expect(getGeneratedAnalyticsMetadata(secondDismiss)).toEqual({
      action: 'dismiss',
      detail: {
        id: 'second',
        label: 'Dismiss second tab',
        position: '2',
      },
      ...getTabsComponentContexts(0, 1),
    });
    const secondActions = wrapper.findActionByTabId('second')!.findButtonDropdown()!.findNativeButton()!.getElement();
    validateComponentNameAndLabels(secondActions, labels);
    expect(getGeneratedAnalyticsMetadata(secondActions)).toEqual({
      action: 'expand',
      detail: {
        expanded: 'true',
        label: 'Query actions for second tab',
      },
      contexts: [
        {
          type: 'component',
          detail: {
            name: 'awsui.ButtonDropdown',
            label: 'Query actions for second tab',
            properties: {
              variant: 'icon',
              disabled: 'false',
            },
          },
        },
        ...(getTabsComponentContexts(0, 1).contexts as []),
      ],
    });
  });
});
