// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import GenericTokenGroup, { GenericTokenGroupProps } from '../../../lib/components/token-group/generic-token-group';
import createWrapper, { TokenGroupWrapper } from '../../../lib/components/test-utils/dom';

interface Item {
  name: string;
}

const defaultProps: GenericTokenGroupProps<Item> = {
  items: generateItems(5),
  alignment: 'horizontal',
  renderItem: item => item.name,
  getItemAttributes: item => ({ name: item.name }),
};

function renderTokenGroup(props: Partial<GenericTokenGroupProps<Item>> = {}): TokenGroupWrapper {
  const { container } = render(<GenericTokenGroup {...defaultProps} {...props} />);
  return createWrapper(container).findTokenGroup()!;
}

function generateItems(count: number) {
  return [...new Array(count)].map((_, index) => ({ name: `name-${index}` }));
}

describe('GenericTokenGroup', () => {
  test('tokens have role="group" and aria-label set', async () => {
    renderTokenGroup();

    await expect(screen.findByRole('group', { name: 'name-0' })).resolves.toBeDefined();
  });

  test('tokens do not have role and aria-label set when `asList` is used', async () => {
    renderTokenGroup({ asList: true });

    await expect(screen.findByRole('group', { name: 'name-0' })).rejects.toBeDefined();
  });
});
