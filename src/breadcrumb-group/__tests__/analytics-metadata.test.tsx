// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { activateAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import BreadcrumbGroup from '../../../lib/components/breadcrumb-group';
import {
  GeneratedAnalyticsMetadataBreadcrumbGroupCollapse,
  GeneratedAnalyticsMetadataBreadcrumbGroupExpand,
} from '../../../lib/components/breadcrumb-group/analytics-metadata/interfaces';
import { getItemsDisplayProperties } from '../../../lib/components/breadcrumb-group/utils';
import createWrapper from '../../../lib/components/test-utils/dom';
import { validateComponentNameAndLabels } from '../../internal/__tests__/analytics-metadata-test-utils';

import ownLabels from '../../../lib/components/breadcrumb-group/analytics-metadata/styles.css.js';
import buttonDropdownLabels from '../../../lib/components/button-dropdown/analytics-metadata/styles.css.js';

jest.mock('../../../lib/components/breadcrumb-group/utils', () => ({
  getItemsDisplayProperties: jest.fn().mockReturnValue({
    shrinkFactors: [0, 0, 0, 0],
    minWidths: [100, 100, 100, 100],
    collapsed: 0,
  }),
}));

const labels = { ...ownLabels, ...buttonDropdownLabels };

const items = [
  { text: 'Long breacrumb long breacrumb long breacrumb', href: '#' },
  { text: 'Components', href: '#one' },
  { text: 'System', href: '#two' },
  { text: 'Three', href: '#three' },
];
const ariaLabel = 'bcg';

function renderBreadcrumbGroup() {
  const renderResult = render(<BreadcrumbGroup items={items} ariaLabel={ariaLabel} />);
  return createWrapper(renderResult.container).findBreadcrumbGroup()!;
}

const contexts = [
  {
    type: 'component',
    detail: {
      name: 'awsui.BreadcrumbGroup',
      label: ariaLabel,
    },
  },
];

const getClickEventDetails = (position: number) => ({
  action: 'click',
  detail: {
    position: `${position}`,
    href: items[position - 1].href,
    label: items[position - 1].text,
  },
});

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('BreadcrumbGroup renders correct analytics metadata', () => {
  test('in desktop view', () => {
    const wrapper = renderBreadcrumbGroup();

    const firstBreadcrumb = wrapper.findBreadcrumbLink(1)!.getElement();
    validateComponentNameAndLabels(firstBreadcrumb, labels);
    expect(getGeneratedAnalyticsMetadata(firstBreadcrumb)).toEqual({
      ...getClickEventDetails(1),
      contexts,
    });
    const thirdBreadcrumb = wrapper.findBreadcrumbLink(3)!.getElement();
    validateComponentNameAndLabels(thirdBreadcrumb, labels);
    expect(getGeneratedAnalyticsMetadata(thirdBreadcrumb)).toEqual({
      ...getClickEventDetails(3),
      contexts,
    });

    // last breadcrumb is not decorated with click event information
    const lastBreadcrumb = wrapper.findBreadcrumbLink(4)!.getElement();
    expect(getGeneratedAnalyticsMetadata(lastBreadcrumb)).toEqual({
      contexts,
    });
  });
  test('in mobile view', () => {
    (getItemsDisplayProperties as jest.Mock).mockReturnValue({
      shrinkFactors: [0, 0, 0, 0],
      minWidths: [100, 100, 100, 100],
      collapsed: 2,
    });
    const wrapper = renderBreadcrumbGroup();

    const firstBreadcrumb = wrapper.findBreadcrumbLink(1)!.getElement();
    validateComponentNameAndLabels(firstBreadcrumb, labels);
    expect(getGeneratedAnalyticsMetadata(firstBreadcrumb)).toEqual({
      ...getClickEventDetails(1),
      contexts,
    });
    const triggerButton = wrapper.findDropdown()!.findTriggerButton()!;
    validateComponentNameAndLabels(triggerButton.getElement(), labels);
    const expectedExpandMetadata: GeneratedAnalyticsMetadataBreadcrumbGroupExpand = {
      action: 'expand',
      detail: {
        label: '...',
      },
    };
    expect(getGeneratedAnalyticsMetadata(triggerButton.getElement())).toEqual({
      ...expectedExpandMetadata,
      contexts,
    });

    triggerButton.click();
    const expectedCollapseMetadata: GeneratedAnalyticsMetadataBreadcrumbGroupCollapse = {
      action: 'collapse',
      detail: {
        label: '...',
      },
    };
    expect(getGeneratedAnalyticsMetadata(triggerButton.getElement())).toEqual({
      ...expectedCollapseMetadata,
      contexts,
    });

    const dropdownItems = wrapper.findDropdown()!.findItems()!;
    const thirdBreadcrumb = dropdownItems[1].getElement();
    validateComponentNameAndLabels(thirdBreadcrumb, labels);
    expect(getGeneratedAnalyticsMetadata(thirdBreadcrumb)).toEqual({
      ...getClickEventDetails(3),
      contexts,
    });
  });
});
