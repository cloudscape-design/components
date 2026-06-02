// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { activateAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import BreadcrumbGroup from '../../../lib/components/breadcrumb-group';
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

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('BreadcrumbGroup renders correct analytics metadata', () => {
  test('in desktop view', () => {
    const wrapper = renderBreadcrumbGroup();

    const firstBreadcrumb = wrapper.findBreadcrumbLink(1)!.getElement();
    validateComponentNameAndLabels(firstBreadcrumb, labels);
    expect(getGeneratedAnalyticsMetadata(firstBreadcrumb)).toMatchSnapshot();
    const thirdBreadcrumb = wrapper.findBreadcrumbLink(3)!.getElement();
    validateComponentNameAndLabels(thirdBreadcrumb, labels);
    expect(getGeneratedAnalyticsMetadata(thirdBreadcrumb)).toMatchSnapshot();

    // last breadcrumb is not decorated with click event information
    const lastBreadcrumb = wrapper.findBreadcrumbLink(4)!.getElement();
    expect(getGeneratedAnalyticsMetadata(lastBreadcrumb)).toMatchSnapshot();
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
    expect(getGeneratedAnalyticsMetadata(firstBreadcrumb)).toMatchSnapshot();
    const triggerButton = wrapper.findDropdown()!.findTriggerButton()!;
    validateComponentNameAndLabels(triggerButton.getElement(), labels);
    expect(getGeneratedAnalyticsMetadata(triggerButton.getElement())).toMatchSnapshot();

    triggerButton.click();
    expect(getGeneratedAnalyticsMetadata(triggerButton.getElement())).toMatchSnapshot();

    const dropdownItems = wrapper.findDropdown()!.findItems()!;
    const thirdBreadcrumb = dropdownItems[1].getElement();
    validateComponentNameAndLabels(thirdBreadcrumb, labels);
    expect(getGeneratedAnalyticsMetadata(thirdBreadcrumb)).toMatchSnapshot();
  });
});
