// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  activateAnalyticsMetadata,
  GeneratedAnalyticsMetadataFragment,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import Button from '../../../lib/components/button';
import ExpandableSection, { ExpandableSectionProps } from '../../../lib/components/expandable-section';
import InternalExpandableSection from '../../../lib/components/expandable-section/internal';
import Link from '../../../lib/components/link';
import createWrapper from '../../../lib/components/test-utils/dom';
import { validateComponentNameAndLabels } from '../../internal/__tests__/analytics-metadata-test-utils';

import labels from '../../../lib/components/expandable-section/analytics-metadata/styles.css.js';

function renderExpandableSection(props: ExpandableSectionProps) {
  const renderResult = render(<ExpandableSection {...props} />);
  return createWrapper(renderResult.container).findExpandableSection()!;
}

const getContextsMetadata = (label: string, variant: string, expanded: boolean) => {
  const metadata: GeneratedAnalyticsMetadataFragment = {
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.ExpandableSection',
          label,
          properties: {
            variant,
            expanded: `${!!expanded}`,
          },
        },
      },
    ],
  };
  return metadata;
};

const getExpandMetadata = (label: string, variant: string, expanded: boolean) => ({
  ...getContextsMetadata(label, variant, expanded),
  action: 'expand',
  detail: {
    expanded: `${!expanded}`,
    label,
  },
});

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('Expandable section renders correct analytics metadata', () => {
  describe.each(['default', 'footer', 'navigation', 'container', 'stacked'])('%s variant', variant => {
    test.each(['with header', 'with headerText'])('%s', type => {
      const header = ['container', 'stacked'].includes(variant) ? <h3>header</h3> : 'header';
      const wrapper = renderExpandableSection(
        type === 'with header'
          ? {
              header,
              children: 'content',
              variant: variant as ExpandableSectionProps['variant'],
            }
          : {
              headerText: 'header',
              children: 'content',
              variant: variant as ExpandableSectionProps['variant'],
            }
      );
      validateComponentNameAndLabels(wrapper.findExpandButton()!.getElement(), labels);
      expect(getGeneratedAnalyticsMetadata(wrapper.findExpandButton()!.getElement())).toEqual(
        getExpandMetadata('header', variant, false)
      );

      wrapper.findExpandButton().click();
      expect(getGeneratedAnalyticsMetadata(wrapper.findExpandButton()!.getElement())).toEqual(
        getExpandMetadata('header', variant, true)
      );
    });
  });
  test.each(['container', 'stacked'])('%s variant with additional properties', variant => {
    const wrapper = renderExpandableSection({
      headerText: 'header',
      children: 'content',
      variant: variant as ExpandableSectionProps['variant'],
      headerActions: <Button>Edit</Button>,
      headerInfo: <Link variant="info">Info</Link>,
      headerCounter: '5',
      headerDescription: 'description',
    });
    validateComponentNameAndLabels(wrapper.findExpandButton()!.getElement(), labels);
    expect(getGeneratedAnalyticsMetadata(wrapper.findExpandButton()!.getElement())).toEqual(
      getExpandMetadata('header', variant, false)
    );

    expect(getGeneratedAnalyticsMetadata(wrapper.findHeader().findButton()!.getElement())).toEqual({
      contexts: [
        {
          type: 'component',
          detail: {
            name: 'awsui.Button',
            label: 'Edit',
            properties: { disabled: 'false', variant: 'normal' },
          },
        },
        ...getContextsMetadata('header', variant, false).contexts!,
      ],
      action: 'click',
      detail: { label: 'Edit' },
    });
    expect(getGeneratedAnalyticsMetadata(wrapper.findHeader().findLink()!.getElement())).toEqual({
      contexts: [
        {
          type: 'component',
          detail: {
            name: 'awsui.Link',
            label: 'Info:',
            properties: { variant: 'info' },
          },
        },
        ...getContextsMetadata('header', variant, false).contexts!,
      ],
      action: 'click',
      detail: { label: 'Info:', external: 'false' },
    });
  });
});

test('Internal ExpandableSection does not render "component" metadata', () => {
  const renderResult = render(
    <InternalExpandableSection headerText="whatever">inline button text</InternalExpandableSection>
  );
  const button = createWrapper(renderResult.container).findExpandableSection()!.findExpandButton()!.getElement();
  expect(getGeneratedAnalyticsMetadata(button)).toEqual({
    action: 'expand',
    detail: {
      label: 'whatever',
      expanded: 'true',
    },
  });
});
