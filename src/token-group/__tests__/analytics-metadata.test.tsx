// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  activateAnalyticsMetadata,
  GeneratedAnalyticsMetadataFragment,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import createWrapper from '../../../lib/components/test-utils/dom';
import TokenGroup, { TokenGroupProps } from '../../../lib/components/token-group';
import InternalTokenGroup from '../../../lib/components/token-group/internal';

function renderTokenGroup(props: TokenGroupProps) {
  const renderResult = render(<TokenGroup items={items} onDismiss={() => {}} {...props} />);
  return createWrapper(renderResult.container).findTokenGroup()!;
}

const items: TokenGroupProps['items'] = [
  { label: 'Item 1' },
  {
    label: 'Item 2',
    description: 'This is a description for item 2',
    labelTag: 'Label tag 1',
    tags: ['Tag 1', 'Tag 2'],
    iconName: 'share',
  },
  { label: 'Item 3', disabled: true },
  { label: 'Item 4' },
  { label: 'Item 5' },
  { label: 'Item 6' },
  { label: 'Item 7' },
  { label: 'Item 8' },
].map(item => ({ ...item, dismissLabel: `Dismiss ${item.label}` }) as TokenGroupProps.Item);

const getMetadataContexts = (itemsCount = items.length) => {
  const metadata: GeneratedAnalyticsMetadataFragment = {
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.TokenGroup',
          label: '',
          properties: {
            itemsCount: `${itemsCount}`,
          },
        },
      },
    ],
  };
  return metadata;
};

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('Token Group renders correct analytics metadata', () => {
  test('when readonly', () => {
    const wrapper = renderTokenGroup({ readOnly: true });

    const simpleToken = wrapper.findToken(1)!.findDismiss().getElement();
    expect(getGeneratedAnalyticsMetadata(simpleToken)).toEqual(getMetadataContexts());
  });

  test('with different items count', () => {
    const wrapper = renderTokenGroup({ readOnly: true, items: [items[0]] });

    const simpleToken = wrapper.findToken(1)!.findDismiss().getElement();
    expect(getGeneratedAnalyticsMetadata(simpleToken)).toEqual(getMetadataContexts(1));
  });

  test('in dismiss button', () => {
    const wrapper = renderTokenGroup({});

    const simpleToken = wrapper.findToken(1)!.findDismiss().getElement();
    expect(getGeneratedAnalyticsMetadata(simpleToken)).toEqual({
      action: 'dismiss',
      detail: {
        label: 'Dismiss Item 1',
        position: '1',
      },
      ...getMetadataContexts(),
    });

    const complexToken = wrapper.findToken(2)!.findDismiss().getElement();
    expect(getGeneratedAnalyticsMetadata(complexToken)).toEqual({
      action: 'dismiss',
      detail: {
        label: 'Dismiss Item 2',
        position: '2',
      },
      ...getMetadataContexts(),
    });

    const disabledToken = wrapper.findToken(3)!.findDismiss().getElement();
    expect(getGeneratedAnalyticsMetadata(disabledToken)).toEqual(getMetadataContexts());
  });

  test('in show more', () => {
    const wrapper = renderTokenGroup({
      limit: 3,
      limitShowFewerAriaLabel: 'show less',
      limitShowMoreAriaLabel: 'show more',
    });

    const tokenToggle = wrapper.findTokenToggle()!.getElement();
    expect(getGeneratedAnalyticsMetadata(tokenToggle)).toEqual({
      action: 'showMore',
      detail: {
        label: 'show more',
        expanded: 'true',
      },
      ...getMetadataContexts(),
    });

    wrapper.findTokenToggle()!.click();
    expect(getGeneratedAnalyticsMetadata(wrapper.findTokenToggle()!.getElement())).toEqual({
      action: 'showMore',
      detail: {
        label: 'show less',
        expanded: 'false',
      },
      ...getMetadataContexts(),
    });
  });
});

test('Internal Token Group does not render "component" metadata', () => {
  const renderResult = render(<InternalTokenGroup items={items} alignment="horizontal" onDismiss={() => {}} />);
  const wrapper = createWrapper(renderResult.container).findTokenGroup();
  expect(getGeneratedAnalyticsMetadata(wrapper!.getElement())).toEqual({});
});
