// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { activateAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import Badge from '../../../lib/components/badge';
import SideNavigation, { SideNavigationProps } from '../../../lib/components/side-navigation';
import createWrapper from '../../../lib/components/test-utils/dom';
import { validateComponentNameAndLabels } from '../../internal/__tests__/analytics-metadata-test-utils';

import expandableSectionLabels from '../../../lib/components/expandable-section/analytics-metadata/styles.css.js';
import sideNavigationLabels from '../../../lib/components/side-navigation/analytics-metadata/styles.css.js';
const labels = { ...sideNavigationLabels, ...expandableSectionLabels };

const pageLink = (pageNumber: number): SideNavigationProps.Link => ({
  type: 'link',
  text: `Page ${pageNumber}`,
  href: `#/page${pageNumber}`,
});

const items: SideNavigationProps['items'] = [
  pageLink(1),
  { type: 'divider' },
  {
    type: 'link',
    text: 'Documentation',
    href: 'https://example.com',
    external: true,
    info: <Badge color="red">23</Badge>,
  },
  {
    type: 'section',
    text: 'Section heading',
    items: [pageLink(2), pageLink(3)],
  },
  {
    type: 'section-group',
    title: 'Section group',
    items: [{ ...pageLink(4), external: true }, pageLink(5)],
  },
  {
    type: 'expandable-link-group',
    text: 'Parent page',
    href: '#/parent-page',
    items: [pageLink(6), pageLink(7)],
  },
  {
    type: 'link-group',
    text: 'View resources page',
    href: '#/resources-page',
    items: [pageLink(8), pageLink(9)],
  },
];

function renderSideNavigation(props?: SideNavigationProps) {
  const renderResult = render(
    <SideNavigation activeHref="#" header={{ href: '#', text: 'Service name' }} items={items} {...props} />
  );
  return createWrapper(renderResult.container).findSideNavigation()!;
}

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('Side Navigation renders correct analytics metadata', () => {
  describe('for click events', () => {
    test('in the header', () => {
      const wrapper = renderSideNavigation();
      const headerLink = wrapper.findHeaderLink()!.getElement();
      validateComponentNameAndLabels(headerLink, labels);
      expect(getGeneratedAnalyticsMetadata(headerLink)).toMatchSnapshot();
    });
    test('in simple items', () => {
      const wrapper = renderSideNavigation();

      const simpleLink = wrapper.findLinkByHref('#/page1')!.getElement();
      validateComponentNameAndLabels(simpleLink, labels);
      expect(getGeneratedAnalyticsMetadata(simpleLink)).toMatchSnapshot();

      const externalLink = wrapper.findLinkByHref('https://example.com')!.getElement();
      validateComponentNameAndLabels(externalLink, labels);
      expect(getGeneratedAnalyticsMetadata(externalLink)).toMatchSnapshot();
    });
    test('in section', () => {
      const wrapper = renderSideNavigation();
      const link = wrapper.findLinkByHref('#/page2')!.getElement();
      validateComponentNameAndLabels(link, labels);
      expect(getGeneratedAnalyticsMetadata(link)).toMatchSnapshot();
    });
    test('in section group', () => {
      const wrapper = renderSideNavigation();
      const link = wrapper.findLinkByHref('#/page4')!.getElement();
      validateComponentNameAndLabels(link, labels);
      expect(getGeneratedAnalyticsMetadata(link)).toMatchSnapshot();
    });
    test('in expandable link group', () => {
      const wrapper = renderSideNavigation();

      const parentLink = wrapper.findLinkByHref('#/parent-page')!.getElement();
      validateComponentNameAndLabels(parentLink, labels);
      expect(getGeneratedAnalyticsMetadata(parentLink)).toMatchSnapshot();

      const link = wrapper.findLinkByHref('#/page6')!.getElement();
      validateComponentNameAndLabels(link, labels);
      expect(getGeneratedAnalyticsMetadata(link)).toMatchSnapshot();
    });
    test('in link group', () => {
      const wrapper = renderSideNavigation();

      const parentLink = wrapper.findLinkByHref('#/resources-page')!.getElement();
      validateComponentNameAndLabels(parentLink, labels);
      expect(getGeneratedAnalyticsMetadata(parentLink)).toMatchSnapshot();

      const link = wrapper.findLinkByHref('#/page8')!.getElement();
      validateComponentNameAndLabels(link, labels);
      expect(getGeneratedAnalyticsMetadata(link)).toMatchSnapshot();
    });
  });
  describe('for expand events', () => {
    test('in section', () => {
      const wrapper = renderSideNavigation();

      const expandButton = wrapper.findItemByIndex(4)!.findSection()!.findExpandButton()!.getElement();
      validateComponentNameAndLabels(expandButton, labels);
      expect(getGeneratedAnalyticsMetadata(expandButton)).toMatchSnapshot();
    });
    test('in expandable link group', () => {
      const wrapper = renderSideNavigation();

      const expandButton = wrapper.findItemByIndex(6)!.findExpandableLinkGroup()!.findExpandButton()!.getElement();
      validateComponentNameAndLabels(expandButton, labels);
      expect(getGeneratedAnalyticsMetadata(expandButton)).toMatchSnapshot();
    });
  });
});
