// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import ButtonGroup, { ButtonGroupProps } from '../../../lib/components/button-group';
import createWrapper from '../../../lib/components/test-utils/dom';
import TestI18nProvider from '../../../lib/components/i18n/testing';

const i18nMessages = {
  'button-group': {
    'i18nStrings.showMoreButtonAriaLabel': 'Show more',
  },
};

const renderButtonGroup = (props: ButtonGroupProps, ref?: React.Ref<ButtonGroupProps.Ref>) => {
  const renderResult = render(
    <TestI18nProvider messages={i18nMessages}>
      <ButtonGroup ref={ref} {...props} />
    </TestI18nProvider>
  );
  return createWrapper(renderResult.container).findButtonGroup()!;
};

const items1: ButtonGroupProps.ItemOrGroup[] = [
  {
    id: 'feedback',
    text: 'Feedback',
    items: [
      { id: 'like', text: 'Like', iconName: 'thumbs-up', actionPopoverText: 'Liked' },
      { id: 'dislike', text: 'dislike', iconName: 'thumbs-down', actionPopoverText: 'Disliked' },
    ],
  },
  { id: 'copy', iconName: 'copy', text: 'Copy', actionPopoverText: 'Copied' },
  { id: 'edit', iconName: 'edit', text: 'Edit' },
  { id: 'open', iconName: 'file-open', text: 'Open' },
  { id: 'search', iconName: 'search', text: 'Search' },
  {
    id: 'misc',
    text: 'Misc',
    items: [
      { id: 'edit', iconName: 'edit', text: 'Edit' },
      { id: 'open', iconName: 'file-open', text: 'Open' },
      { id: 'search', iconName: 'search', text: 'Search' },
    ],
  },
];

// TODO: use button group test utils to find items
test('renders all items inline when limit=9', () => {
  const wrapper = renderButtonGroup({ items: items1, limit: 9 });

  expect(wrapper.findAll('button')).toHaveLength(9);
});
test('moves misc items to under menu when limit=8', () => {
  const wrapper = renderButtonGroup({ items: items1, limit: 8 });

  // 6 inline items and 1 menu dropdown
  expect(wrapper.findAll('button')).toHaveLength(6 + 1);
});
test('moves misc items and search to under menu when limit=5', () => {
  const wrapper = renderButtonGroup({ items: items1, limit: 5 });

  // 6 inline items and 1 menu dropdown
  expect(wrapper.findAll('button')).toHaveLength(5 + 1);
});
test.each([0, 1])('moves all items to under menu when limit=%s', limit => {
  const wrapper = renderButtonGroup({ items: items1, limit });

  // 1 menu dropdown
  expect(wrapper.findAll('button')).toHaveLength(1);
});

// TODO: use button group test utils to find items
describe('i18n', () => {
  test('uses showMoreButtonAriaLabel from I18nProvider', () => {
    const wrapper = renderButtonGroup({ items: items1, limit: 0 });
    expect(wrapper.find('button')!.getElement()).toHaveAccessibleName('Show more');
  });

  test('uses showMoreButtonAriaLabel from i18nStrings', () => {
    const wrapper = renderButtonGroup({
      items: items1,
      limit: 0,
      i18nStrings: { showMoreButtonAriaLabel: 'Show more from i18nStrings' },
    });
    expect(wrapper.find('button')!.getElement()).toHaveAccessibleName('Show more from i18nStrings');
  });
});
