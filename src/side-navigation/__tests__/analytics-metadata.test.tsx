// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  activateAnalyticsMetadata,
  GeneratedAnalyticsMetadataFragment,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import Badge from '../../../lib/components/badge';
import SideNavigation, { SideNavigationProps } from '../../../lib/components/side-navigation';
import {
  GeneratedAnalyticsMetadataSideNavigationCollapse,
  GeneratedAnalyticsMetadataSideNavigationExpand,
} from '../../../lib/components/side-navigation/analytics-metadata/interfaces';
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

const getMetadataContexts = () => {
  const metadata: GeneratedAnalyticsMetadataFragment = {
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.SideNavigation',
          label: 'Service name',
          properties: {
            activeHref: '#',
          },
        },
      },
    ],
  };
  return metadata;
};

const getClickGeneratedMetadata = (label: string, position: string, href: string, external = 'false') => ({
  action: 'click',
  detail: {
    position,
    href,
    external,
    label,
  },
  ...getMetadataContexts(),
});

const getExpandGeneratedMetadata = (label: string, expanded = false) => {
  const partialMetadata:
    | GeneratedAnalyticsMetadataSideNavigationExpand
    | GeneratedAnalyticsMetadataSideNavigationCollapse = {
    action: !expanded ? 'expand' : 'collapse',
    detail: {
      label,
    },
  };

  return {
    ...partialMetadata,
    ...getMetadataContexts(),
  };
};

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('Side Navigation renders correct analytics metadata', () => {
  describe('for click events', () => {
    test('in the header', () => {
      const wrapper = renderSideNavigation();
      const headerLink = wrapper.findHeaderLink()!.getElement();
      validateComponentNameAndLabels(headerLink, labels);
      expect(getGeneratedAnalyticsMetadata(headerLink)).toEqual(
        getClickGeneratedMetadata('Service name', 'header', '#')
      );
    });
    test('in simple items', () => {
      const wrapper = renderSideNavigation();

      const simpleLink = wrapper.findLinkByHref('#/page1')!.getElement();
      validateComponentNameAndLabels(simpleLink, labels);
      expect(getGeneratedAnalyticsMetadata(simpleLink)).toEqual(getClickGeneratedMetadata('Page 1', '1', '#/page1'));

      const externalLink = wrapper.findLinkByHref('https://example.com')!.getElement();
      validateComponentNameAndLabels(externalLink, labels);
      expect(getGeneratedAnalyticsMetadata(externalLink)).toEqual(
        getClickGeneratedMetadata('Documentation', '3', 'https://example.com', 'true')
      );
    });
    test('in section', () => {
      const wrapper = renderSideNavigation();
      const link = wrapper.findLinkByHref('#/page2')!.getElement();
      validateComponentNameAndLabels(link, labels);
      expect(getGeneratedAnalyticsMetadata(link)).toEqual(getClickGeneratedMetadata('Page 2', '4,1', '#/page2'));
    });
    test('in section group', () => {
      const wrapper = renderSideNavigation();
      const link = wrapper.findLinkByHref('#/page4')!.getElement();
      validateComponentNameAndLabels(link, labels);
      expect(getGeneratedAnalyticsMetadata(link)).toEqual(
        getClickGeneratedMetadata('Page 4', '5,1', '#/page4', 'true')
      );
    });
    test('in expandable link group', () => {
      const wrapper = renderSideNavigation();

      const parentLink = wrapper.findLinkByHref('#/parent-page')!.getElement();
      validateComponentNameAndLabels(parentLink, labels);
      expect(getGeneratedAnalyticsMetadata(parentLink)).toEqual(
        getClickGeneratedMetadata('Parent page', '6', '#/parent-page')
      );

      const link = wrapper.findLinkByHref('#/page6')!.getElement();
      validateComponentNameAndLabels(link, labels);
      expect(getGeneratedAnalyticsMetadata(link)).toEqual(getClickGeneratedMetadata('Page 6', '6,1', '#/page6'));
    });
    test('in link group', () => {
      const wrapper = renderSideNavigation();

      const parentLink = wrapper.findLinkByHref('#/resources-page')!.getElement();
      validateComponentNameAndLabels(parentLink, labels);
      expect(getGeneratedAnalyticsMetadata(parentLink)).toEqual(
        getClickGeneratedMetadata('View resources page', '7', '#/resources-page')
      );

      const link = wrapper.findLinkByHref('#/page8')!.getElement();
      validateComponentNameAndLabels(link, labels);
      expect(getGeneratedAnalyticsMetadata(link)).toEqual(getClickGeneratedMetadata('Page 8', '7,1', '#/page8'));
    });
  });
  describe('for expand events', () => {
    test('in section', () => {
      const wrapper = renderSideNavigation();

      const expandButton = wrapper.findItemByIndex(4)!.findSection()!.findExpandButton()!.getElement();
      validateComponentNameAndLabels(expandButton, labels);
      expect(getGeneratedAnalyticsMetadata(expandButton)).toEqual(getExpandGeneratedMetadata('Section heading', true));
    });
    test('in expandable link group', () => {
      const wrapper = renderSideNavigation();

      const expandButton = wrapper.findItemByIndex(6)!.findExpandableLinkGroup()!.findExpandButton()!.getElement();
      validateComponentNameAndLabels(expandButton, labels);
      expect(getGeneratedAnalyticsMetadata(expandButton)).toEqual(getExpandGeneratedMetadata('Parent page'));
    });
  });
});
